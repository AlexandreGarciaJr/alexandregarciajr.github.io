<?php
ob_start();

$smtpUser     = "alexandregojunior@gmail.com";
$smtpPass     = "bwxo fkxg hkqm mslt";
$smtp         = "smtp.gmail.com";
$porta        = 465;

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);

require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$nome      = trim($_POST['nome'] ?? '');
$emailForm = trim($_POST['email'] ?? '');
$telefone  = trim($_POST['telefone'] ?? '');
$tipo      = trim($_POST['tipo'] ?? '');
$mensagem  = trim($_POST['mensagem'] ?? '');

if (!$nome || !$emailForm || !$mensagem) {
    ob_end_clean();
    http_response_code(422);
    echo json_encode(['ok' => false]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug  = 0;
    $mail->isSMTP();
    $mail->Host       = $smtp;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $porta;
    $mail->CharSet    = 'utf-8';

    $mail->setFrom($smtpUser, 'Site Portfólio');
    $mail->addAddress($smtpUser);
    $mail->addReplyTo($emailForm, $nome);

    $mail->isHTML(true);
    $mail->Subject = "Novo contato: $nome";
    $mail->Body    = "
        <h3>Nova mensagem do site</h3>
        <p><strong>Nome:</strong> $nome</p>
        <p><strong>Email:</strong> $emailForm</p>
        <p><strong>Telefone:</strong> $telefone</p>
        <p><strong>Tipo:</strong> $tipo</p>
        <p><strong>Mensagem:</strong><br>$mensagem</p>
    ";

    $mail->send();

    ob_end_clean();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'ok'   => false,
        'erro' => $mail->ErrorInfo
    ]);
}