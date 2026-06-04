<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wordpress avec Docker!</title>
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<header class="main-header">
    <h1>Wordpress avec Docker!!</h1>
    <nav class="main-nav">
        <ul>
            <li><a href="#" data-section="accueil">Accueil</a></li>
            <li><a href="#" data-section="services">Nos services</a></li>
            <li><a href="#" data-section="blog">Blog</a></li>
            <li><a href="#" data-section="actualités">Actualités</a></li>
            <li><a href="#" data-section="contact">Contact</a></li>
        </ul>
    </nav>
</header>

<main id="app-content" class="container">
    </main>

<footer class="main-footer">
    <p>&copy; 2026 Mon Thème perso. Tous droits réservés</p>
</footer> 

<?php wp_footer(); ?>
</body>
</html>