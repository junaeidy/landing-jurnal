<?php

namespace App\Helpers;

class TranslationHelpers
{
    public static function allTranslations()
    {
        return [
            'navbar' => [
                'home' => __('navbar.home'),
                'journal' => __('navbar.journal'),
                'events' => __('navbar.events'),
                'team' => __('navbar.team'),
                'about_us' => __('navbar.about_us'),
                'login' => __('navbar.login'),
                'dashboard' => __('navbar.dashboard'),
            ],
            'footer' => [
                'title' => __('footer.title'),
                'description' => __('footer.description'),
                'navigation' => __('footer.navigation'),
                'home' => __('footer.home'),
                'events' => __('footer.events'),
                'team' => __('footer.team'),
                'about' => __('footer.about'),
                'journal' => __('footer.journal'),
                'contact' => __('footer.contact'),
                'email' => __('footer.email'),
                'phone' => __('footer.phone'),
                'address' => __('footer.address'),
                'copyright' => __('footer.copyright'),
            ],
            'buttons' => [
                'register' => __('buttons.register'),
                'whatsapp' => __('buttons.whatsapp'),
            ],
            'partner' => [
                'title' => __('partner.title'),
            ],
            'journal' => [
                'title' => __('journal.title'),
                'find_title' => __('journal.find_title'),
                'find_description' => __('journal.find_description'),
                'read_more' => __('journal.read_more'),
                'read_less' => __('journal.read_less'),
                'view_all' => __('journal.view_all'),
                'visit' => __('journal.visit'),
                'contact' => __('journal.contact'),
                'published_year' => __('journal.published_year'),
                'acceptance_rate' => __('journal.acceptance_rate'),
                'decision_days' => __('journal.decision_days'),
                'impact_factor' => __('journal.impact_factor'),
            ],
            'event' => [
                'title' => __('event.title'),
                'find_title' => __('event.find_title'),
                'find_description' => __('event.find_description'),
            ],
            'team' => [
                'find_title' => __('team.find_title'),
                'list_description' => __('team.list_description'),
                'find_description' => __('team.find_description'),
            ],
            'about' => [
                'find_title' => __('about.find_title'),
                'find_description' => __('about.find_description'),
            ],
        ];
    }
}
