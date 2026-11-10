<?php
/**
 * Endpoint formular contact Andaxi — trimite prin SMTP Hostinger.
 *
 * INSTALARE (o singură dată):
 *  1. În hPanel creezi un subdomeniu PHP: api.andaxi.ro (Custom PHP/HTML website).
 *  2. Urci acest fișier în public_html al subdomeniului.
 *  3. Editezi fișierul în File Manager și pui parola căsuței contact@andaxi.ro
 *     în SMTP_PASS de mai jos. Parola rămâne DOAR pe server — nu o urca pe git!
 */

const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;
const SMTP_USER = 'contact@andaxi.ro';
const SMTP_PASS = 'PUNE_PAROLA_AICI';
const TO_EMAIL  = 'contact@andaxi.ro';
const FROM_NAME = 'Andaxi';
const ALLOWED_ORIGINS = [
  'https://andaxi.ro',
  'https://www.andaxi.ro',
  'https://teal-jellyfish-198077.hostingersite.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

// Rate-limit simplu: max o trimitere la 30s per IP.
$ipFile = sys_get_temp_dir() . '/andaxi-contact-' . md5($_SERVER['REMOTE_ADDR'] ?? 'x');
if (file_exists($ipFile) && time() - filemtime($ipFile) < 30) {
  http_response_code(429);
  echo json_encode(['ok' => false, 'error' => 'rate']);
  exit;
}
touch($ipFile);

$data    = json_decode(file_get_contents('php://input'), true) ?: [];
$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$phone   = trim($data['phone'] ?? '');
$message = trim($data['message'] ?? '');

if (
  $name === '' || $message === '' ||
  mb_strlen($name) > 200 || mb_strlen($phone) > 50 || mb_strlen($message) > 5000 ||
  !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'invalid']);
  exit;
}

function utf8_header(string $text): string {
  return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

/** Client SMTP minimal (SSL implicit, AUTH LOGIN) — fără dependențe. */
function smtp_send(string $toEmail, string $toName, string $subject, string $body, ?string $replyTo = null, ?string $replyToName = null): void {
  $fp = stream_socket_client('ssl://' . SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 15);
  if (!$fp) {
    throw new Exception("Conexiune SMTP eșuată: $errstr ($errno)");
  }
  stream_set_timeout($fp, 15);

  $expect = function (string $code, ?string $cmd = null) use ($fp): void {
    if ($cmd !== null) {
      fwrite($fp, $cmd . "\r\n");
    }
    $line = '';
    while (($l = fgets($fp, 515)) !== false) {
      $line = $l;
      if (strlen($l) < 4 || $l[3] !== '-') break; // răspunsuri multi-linie
    }
    if (strncmp($line, $code, strlen($code)) !== 0) {
      throw new Exception('SMTP: așteptat ' . $code . ', primit: ' . trim($line));
    }
  };

  $expect('220');
  $expect('250', 'EHLO andaxi.ro');
  $expect('334', 'AUTH LOGIN');
  $expect('334', base64_encode(SMTP_USER));
  $expect('235', base64_encode(SMTP_PASS));
  $expect('250', 'MAIL FROM:<' . SMTP_USER . '>');
  $expect('250', 'RCPT TO:<' . $toEmail . '>');
  $expect('354', 'DATA');

  $headers = [
    'From: ' . utf8_header(FROM_NAME) . ' <' . SMTP_USER . '>',
    'To: ' . utf8_header($toName) . ' <' . $toEmail . '>',
    'Subject: ' . utf8_header($subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'Date: ' . date('r'),
  ];
  if ($replyTo !== null) {
    $headers[] = 'Reply-To: ' . utf8_header($replyToName ?? $replyTo) . ' <' . $replyTo . '>';
  }

  $payload = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body));
  // protecție dot-stuffing
  $payload = preg_replace('/^\./m', '..', $payload);

  fwrite($fp, $payload . "\r\n.\r\n");
  $expect('250');
  fwrite($fp, "QUIT\r\n");
  fclose($fp);
}

try {
  // 1) Mesajul către Andaxi, cu Reply-To vizitator.
  $body = "Mesaj nou de pe andaxi.ro\n\n"
    . "Nume: $name\n"
    . "Email: $email\n"
    . ($phone !== '' ? "Telefon: $phone\n" : '')
    . "\n$message\n";
  smtp_send(TO_EMAIL, 'Andaxi', "Mesaj de pe site — $name", $body, $email, $name);

  // 2) Confirmarea către vizitator.
  $confirm = "Salut, $name!\n\n"
    . "Am primit mesajul tău și te vom contacta în cel mai scurt timp posibil.\n\n"
    . "Mesajul tău:\n"
    . "----------------------------------------\n"
    . "$message\n"
    . "----------------------------------------\n\n"
    . "Dacă e ceva urgent, ne găsești la 0755 885 973.\n\n"
    . "Cu drag,\nEchipa Andaxi\nhttps://andaxi.ro";
  try {
    smtp_send($email, $name, 'Am primit mesajul tău — Andaxi', $confirm);
  } catch (Exception $e) {
    // Mesajul principal a plecat; confirmarea a eșuat — nu blocăm succesul.
  }

  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'smtp']);
}
