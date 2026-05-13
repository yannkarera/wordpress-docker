<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?> - <?php bloginfo('description'); ?></title>
    <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>">
    <?php wp_head(); ?>
</head>
<body>
    <header>
        <h1><?php bloginfo('name'); ?></h1>
        
        <nav>
            <?php wp_nav_menu(
                array(
                    'theme_location' => 'main-menu',
                    'container' => 'ul',
                    'menu_class' => 'menu-principal'
                    )
                    ); ?>
    </nav>
</header>
    
</body>
</html>