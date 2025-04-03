DELETE FROM wp_options
WHERE option_name IN (
    'wp_mail_smtp',
    'wp_mail_smtp_review_notice',
    'wp_mail_smtp_activated',
    'wp_mail_smtp_activated_time',
    'wp_mail_smtp_activation_prevent_redirect'
);

INSERT INTO wp_options (option_name, option_value, autoload)
VALUES
('wp_mail_smtp', 'a:14:{s:4:"mail";a:6:{s:10:"from_email";s:23:"future-free@example.com";s:9:"from_name";s:23:"Future Free - Test Site";s:6:"mailer";s:4:"smtp";s:11:"return_path";b:0;s:16:"from_email_force";b:1;s:15:"from_name_force";b:1;}s:4:"smtp";a:7:{s:7:"autotls";b:0;s:4:"auth";b:0;s:4:"host";s:7:"mailhog";s:10:"encryption";s:4:"none";s:4:"port";i:1025;s:4:"user";s:0:"";s:4:"pass";s:128:"4X2tY4P4EZUkeWLjw6GyqNK3yz8ES6Z5o3ZIDXqQG7xqG9YuYA/eesK3yMiJn44pphNQTpxND+getqKFCnECKisqz5zxKR1LfniSE5bsj/qTScCXvHg5Bj7ssVJksqgP";}s:7:"general";a:1:{s:29:"summary_report_email_disabled";b:0;}s:9:"sendlayer";a:1:{s:7:"api_key";s:0:"";}s:7:"smtpcom";a:2:{s:7:"api_key";s:0:"";s:7:"channel";s:0:"";}s:10:"sendinblue";a:2:{s:7:"api_key";s:0:"";s:6:"domain";s:0:"";}s:12:"elasticemail";a:1:{s:7:"api_key";s:0:"";}s:5:"gmail";a:2:{s:9:"client_id";s:0:"";s:13:"client_secret";s:0:"";}s:7:"mailgun";a:3:{s:7:"api_key";s:0:"";s:6:"domain";s:0:"";s:6:"region";s:2:"US";}s:7:"mailjet";a:2:{s:7:"api_key";s:0:"";s:10:"secret_key";s:0:"";}s:8:"postmark";a:2:{s:16:"server_api_token";s:0:"";s:14:"message_stream";s:0:"";}s:8:"sendgrid";a:2:{s:7:"api_key";s:0:"";s:6:"domain";s:0:"";}s:7:"smtp2go";a:1:{s:7:"api_key";s:0:"";}s:9:"sparkpost";a:2:{s:7:"api_key";s:0:"";s:6:"region";s:2:"US";}}', 'off'),
('wp_mail_smtp_activation_prevent_redirect', '1', 'off'),
('wp_mail_smtp_review_notice', '1', 'off'),
('wp_mail_smtp_activated', 'a:1:{s:4:"lite";i:1741977043;}', 'off'),
('wp_mail_smtp_activated_time', '1741977043', 'off');
