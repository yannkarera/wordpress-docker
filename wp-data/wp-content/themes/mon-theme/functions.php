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


// À ajouter à la fin de ton fichier functions.php

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/news', array(
        'methods' => 'GET',
        'callback' => 'get_belgian_news',
        'permission_callback' => '__return_true' // Permet l'accès public en lecture
    ));
});



function get_belgian_news($request) {
    // 1. TA CLÉ API
    $api_key = '283e8591d97a47eb9688c3b708dc8e74'; 
    
    // Récupération des paramètres optionnels de catégorie ou de recherche
    $category = $request->get_param('category');
    $search = $request->get_param('search');

    // 2. Construction de l'URL pour NewsAPI
    // Dans functions.php, remplace la condition par celle-ci :
    // 2. Construction de l'URL pour NewsAPI (Optimisée et ultra-permissive)
    if (!empty($search)) {
        // Recherche personnalisée par l'utilisateur
        $url = "https://newsapi.org/v2/everything?q=" . urlencode($search) . "&language=fr&sortBy=publishedAt&pageSize=10&apiKey=" . $api_key;
    } elseif (!empty($category)) {
        // Si une catégorie est cochée, on cherche des articles sur ce sujet en français
        $url = "https://newsapi.org/v2/everything?q=" . urlencode($category) . "&language=fr&sortBy=publishedAt&pageSize=10&apiKey=" . $api_key;
    } else {
        // Par défaut : Gros volume d'actualités en français (Évite le totalResults: 0)
        $url = "https://newsapi.org/v2/everything?q=" . urlencode('actualité') . "&language=fr&sortBy=publishedAt&pageSize=10&apiKey=" . $api_key;
    }

    // CONFIGURATION REQUÊTE : On ajoute l'en-tête User-Agent exigé par NewsAPI
  // CONFIGURATION REQUÊTE : On ajoute l'en-tête User-Agent ET on désactive le cache local
    $args = array(
        'timeout'   => 15, // Donne plus de temps au serveur si la connexion Docker est lente
        'headers'   => array(
            'User-Agent' => 'MonApplicationPortfolioWeb/1.0 (Contact: y_karera@outlook.be)'
        )
    );

    // 3. Appel de l'API externe avec les arguments d'en-tête
    $response = wp_remote_get($url, $args);

    // Gérer le cas où l'API externe ne répond pas du tout
    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Impossible de contacter le serveur d\'actualités.', array('status' => 500));
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Gérer le cas où NewsAPI renvoie un code d'erreur
    if (isset($data['status']) && $data['status'] === 'error') {
        return new WP_Error('newsapi_error', $data['message'], array('status' => 400));
    }

    // Renvoie les données propres à ton application JavaScript
    return rest_ensure_response($data);
}