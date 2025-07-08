<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = url(config('app.frontend_url') . '/reset-password/' . $this->token);

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('You are receiving this email because...')
            ->action('Reset Password', $url);
    }
}
