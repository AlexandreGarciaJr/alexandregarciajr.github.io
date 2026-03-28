<?php

// SUAS CONFIGURAÇÕES
define('MAIL_TO',       'contato@alexandregarciajr.com'); // E-mail criado no cPanel (que encaminha pro Gmail)
define('MAIL_FROM',     'contato@alexandregarciajr.com'); // Mesmo e-mail (remetente)
define('MAIL_FROM_NAME','Alexandre Garcia');
define('SITE_URL',      'https://alexandregarciajr.com');
// -----------------------------------------

header('Content-Type: application/json; charset=utf-8');

// Só aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'erro' => 'Método não permitido.']);
    exit;
}

// ---- Coleta e sanitiza ----
$nome     = trim(strip_tags($_POST['nome']     ?? ''));
$email    = trim(strip_tags($_POST['email']    ?? ''));
$telefone = trim(strip_tags($_POST['telefone'] ?? ''));
$tipo     = trim(strip_tags($_POST['tipo']     ?? ''));
$mensagem = trim(strip_tags($_POST['mensagem'] ?? ''));

// ---- Validação no servidor ----
$erros = [];

if (strlen($nome) < 2)
    $erros[] = 'Nome inválido.';

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $erros[] = 'E-mail inválido.';

$tipos_validos = ['site', 'api', 'fullstack', 'arquitetura', 'outro'];
if (!in_array($tipo, $tipos_validos))
    $erros[] = 'Tipo de projeto inválido.';

if (strlen($mensagem) < 10)
    $erros[] = 'Mensagem muito curta.';

if (!empty($erros)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'erros' => $erros]);
    exit;
}

// ---- Tipo legível ----
$tipos_label = [
    'site'        => 'Site / Landing Page',
    'api'         => 'API / Backend',
    'fullstack'   => 'Aplicação Fullstack',
    'arquitetura' => 'Arquitetura de Software',
    'outro'       => 'Outro',
];
$tipo_label = $tipos_label[$tipo] ?? $tipo;

// ---- Monta o e-mail ----
$assunto = "=?UTF-8?B?" . base64_encode("Novo contato: $tipo_label — $nome") . "?=";

$corpo = "Nova mensagem recebida pelo formulário do site.\n";
$corpo .= str_repeat('-', 40) . "\n\n";
$corpo .= "Nome:     $nome\n";
$corpo .= "E-mail:   $email\n";
if ($telefone) {
    $corpo .= "Telefone: $telefone\n";
}
$corpo .= "Projeto:  $tipo_label\n\n";
$corpo .= "Mensagem:\n$mensagem\n\n";
$corpo .= str_repeat('-', 40) . "\n";
$corpo .= "Enviado via " . SITE_URL . "\n";

// ---- Headers ----
$from_encoded = "=?UTF-8?B?" . base64_encode(MAIL_FROM_NAME) . "?=";

$headers  = "From: $from_encoded <" . MAIL_FROM . ">\r\n";
$headers .= "Reply-To: $nome <$email>\r\n"; // Responder vai direto para quem enviou
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: base64\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ---- Envia ----
$enviado = mail(MAIL_TO, $assunto, base64_encode($corpo), $headers);

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    error_log("Falha ao enviar e-mail do formulário de contato. Nome: $nome | E-mail: $email");
    echo json_encode(['ok' => false, 'erro' => 'Falha ao enviar. Tente novamente ou entre em contato diretamente.']);
}

