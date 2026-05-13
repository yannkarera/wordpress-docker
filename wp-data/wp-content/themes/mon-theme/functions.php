<?php
// Force l'écriture directe pour éviter les erreurs de permissions sur Linux/Docker


// 1. Configuration du thème
function mon_theme_setup() {
    register_nav_menus(array(
        'main-menu' => 'Menu Principal',
    ));
    // Active les images à la une pour les articles et services
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'mon_theme_setup');

// 2. Chargement des assets (CSS et JS)
function mon_theme_assets() {
    wp_enqueue_style('main-style', get_stylesheet_uri(), array(), '1.1');

    // Charge ton app.js situé dans le dossier /js/
    wp_enqueue_script('mon-app-js', get_template_directory_uri() . '/js/app.js', array(), '1.1', true);

    // Prépare l'URL de l'API pour ton app.js
    wp_localize_script('mon-app-js', 'WpData', array(
        'rest_url' => esc_url_raw(rest_url()),
    ));
}
add_action('wp_enqueue_scripts', 'mon_theme_assets');

// 3. Déclaration du type "Service" pour ton portfolio
function register_services_post_type() {
    register_post_type('service', array(
        'labels' => array(
            'name' => 'Services',
            'singular_name' => 'Service',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Permet l'accès via /wp-json/wp/v2/service
        'menu_icon' => 'dashicons-rest-api',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
    ));
}
add_action('init', 'register_services_post_type');