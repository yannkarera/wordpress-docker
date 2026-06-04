/**
 * =========================================================================
 * VUE : SERVICES (Custom Post Type)
 * =========================================================================
 */
window.loadServices = async () => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="services-page">
            <h1 class="page-title">Nos services</h1>
            <h2 class="sub-title">Nos Services de Développement Web</h2>
            <div class="grid-container" id="services-grid"></div>
        </div>
    `;

    const servicesGrid = document.getElementById('services-grid');

    try {
        const response = await fetch(`${WpData.rest_url}wp/v2/service?_embed`);
        const services = await response.json();

        servicesGrid.innerHTML = '';

        services.forEach(service => {
            const imageUrl = service._embedded && service._embedded['wp:featuredmedia']
                ? service._embedded['wp:featuredmedia'][0].source_url
                : 'https://via.placeholder.com/300';

            servicesGrid.innerHTML += `
                <article class="card">
                    <img src="${imageUrl}" alt="${service.title.rendered}">
                    <h3>${service.title.rendered}</h3>
                    <div class="excerpt">${service.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 100)}...</div>
                    <button class="btn-blue" onclick="window.loadContact()">Nous contacter</button>
                </article>
            `;
        });
    } catch (error) {
        console.error("Erreur API Services :", error);
        servicesGrid.innerHTML = "<p>Erreur lors du chargement des services.</p>";
    }
};

/**
 * =========================================================================
 * VUE : ACCUEIL
 * =========================================================================
 */
window.loadHome = async () => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <section class="hero-banner">
            <div class="hero-content">
                <h1>Bienvenue sur notre site</h1>
                <p>Découvrez nos services, nos actualités et bien plus encore. Nous sommes là pour répondre à vos besoins.</p>
                <a href="#" class="btn-outline" onclick="window.loadContact()">Nous contacter</a>
            </div>
        </section>
        <section class="about-section">
            <h2>À propos de nous</h2>
            <p>Nous offrons des solutions innovantes pour vous accompagner dans votre projet...</p>
        </section>
        <section class="latest-posts">
            <h2>Nos derniers articles</h2>
            <div class="grid-container" id="home-posts-grid"></div>
        </section>
    `;

    window.loadBlog('home-posts-grid');
};

/**
 * =========================================================================
 * VUE : BLOG
 * =========================================================================
 */
window.loadBlog = async (targetId = null) => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    if (!targetId) {
        contentArea.innerHTML = '<h2 style="text-align:center; margin-top:20px;">Blog</h2><div class="grid-container" id="blog-grid"></div>';
        targetId = 'blog-grid';
    }

    const blogGrid = document.getElementById(targetId);
    if (!blogGrid) return;

    try {
        const response = await fetch(`${WpData.rest_url}wp/v2/posts?per_page=3&_embed`);
        const posts = await response.json();

        blogGrid.innerHTML = '';

        posts.forEach(post => {
            const imageUrl = post._embedded && post._embedded['wp:featuredmedia']
                ? post._embedded['wp:featuredmedia'][0].source_url
                : 'https://via.placeholder.com/300';

            blogGrid.innerHTML += `
                <article class="card">
                    <img src="${imageUrl}" alt="${post.title.rendered}">
                    <h3>${post.title.rendered}</h3>
                    <div class="excerpt">${post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 100)}...</div>
                    <a href="#" class="btn-blue">Lire la suite</a>
                </article>
            `;
        });
    } catch (error) {
        console.error("Erreur API Blog :", error);
    }
};

/**
 * =========================================================================
 * VUE : ACTUALITÉS (Nouvelle section avec Filtres et Recherche)
 * =========================================================================
 */
window.loadNews = async (category = '', searchQuery = '') => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    // Rendu de la structure HTML propre sans CSS inline
    contentArea.innerHTML = `
        <div class="news-page">
            <h1 class="page-title">Actualités de Belgique</h1>
            
            <div class="news-controls">
                <div class="search-box">
                    <input type="text" id="news-search" placeholder="Rechercher une actualité..." value="${searchQuery}">
                    <button class="btn-blue" id="btn-search">Chercher</button>
                </div>
                <div class="categories-filter">
                    <button class="btn-filter ${category === '' ? 'active' : ''}" onclick="window.loadNews('', '')">Toutes</button>
                    <button class="btn-filter ${category === 'business' ? 'active' : ''}" onclick="window.loadNews('business', '')">Business</button>
                    <button class="btn-filter ${category === 'technology' ? 'active' : ''}" onclick="window.loadNews('technology', '')">Tech</button>
                    <button class="btn-filter ${category === 'sports' ? 'active' : ''}" onclick="window.loadNews('sports', '')">Sports</button>
                    <button class="btn-filter ${category === 'health' ? 'active' : ''}" onclick="window.loadNews('health', '')">Santé</button>
                    <button class="btn-filter ${category === 'entertainment' ? 'active' : ''}" onclick="window.loadNews('entertainment', '')">Culture</button>
                </div>
            </div>

            <div class="grid-container" id="news-grid">
                <p class="news-loading">Chargement des actualités en cours...</p>
            </div>
        </div>
    `;

    // Écouteur d'événement pour le bouton de recherche
    document.getElementById('btn-search').addEventListener('click', () => {
        const query = document.getElementById('news-search').value.trim();
        window.loadNews('', query);
    });

    const newsGrid = document.getElementById('news-grid');

    try {
        let fetchUrl = `${WpData.rest_url}custom/v1/news`;
        if (searchQuery) {
            fetchUrl += `?search=${encodeURIComponent(searchQuery)}`;
        } else if (category) {
            fetchUrl += `?category=${category}`;
        }

        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données de l'API.");
        }

        const data = await response.json();
        const articles = data.articles || [];

        // Gestion du cas vide
        if (articles.length === 0) {
            newsGrid.innerHTML = `
                <div class="news-empty-state">
                    <p>Aucune actualité trouvée pour vos critères actuels.</p>
                </div>`;
            return;
        }

        newsGrid.innerHTML = '';

        articles.forEach(article => {
            const imageUrl = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/400x250?text=Belgique+News';
            const description = article.description ? article.description : 'Aucune description disponible pour cet article.';
            
            const publishedDate = new Date(article.publishedAt).toLocaleDateString('fr-BE', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            newsGrid.innerHTML += `
                <article class="card news-card">
                    <div class="card-body-top">
                        <img src="${imageUrl}" alt="${article.title}" class="card-img">
                        <div class="card-text-wrapper">
                            <span class="card-source">${article.source.name}</span>
                            <h3 class="card-title">${article.title}</h3>
                            <p class="excerpt">${description.substring(0, 120)}...</p>
                        </div>
                    </div>
                    <div class="card-body-bottom">
                        <p class="card-date">Publié le : ${publishedDate}</p>
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn-blue card-link">Lire l'article</a>
                    </div>
                </article>
            `;
        });

    } catch (error) {
        console.error("Erreur technique d'affichage des news :", error);
        newsGrid.innerHTML = `
            <div class="news-error-state">
                <p class="error-title">Le service d'actualités est momentanément indisponible.</p>
                <p class="error-subtitle">Veuillez vérifier votre connectivité ou l'état de vos conteneurs Docker.</p>
            </div>`;
    }
};

/**
 * =========================================================================
 * VUE : CONTACT & TRANSMISSION API
 * =========================================================================
 */
window.loadContact = () => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="contact-container">
            <h1 class="contact-title">Contact</h1>
            <div class="form-card">
                <form id="contact-form">
                    <div class="form-group"><label>Votre Nom (obligatoire)</label><input type="text" name="votre-nom" required></div>
                    <div class="form-group"><label>Votre Email (obligatoire)</label><input type="email" name="votre-email" required></div>
                    <div class="form-group"><label>Numéro de téléphone (obligatoire)</label><input type="tel" name="votre-telephone" required></div>
                    <div class="form-group"><label>Poste auquel vous postulez (obligatoire)</label><input type="text" name="poste-occupe" required></div>
                    <div class="form-group"><label>Téléchargez votre CV (PDF, DOC, DOCX, TXT - Max 2MB)</label><input type="file" name="votre-cv" id="votre-cv" accept=".pdf,.doc,.docx,.txt"></div>
                    <div class="form-group"><label>Pourquoi êtes-vous un bon candidat ? (obligatoire)</label><textarea name="pourquoi-vous" rows="6" required></textarea></div>
                    <button type="submit" class="btn-submit">Envoyer ma candidature</button>
                    <div id="form-status" style="margin-top: 15px;"></div>
                </form>
            </div>
        </div>
    `;

    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusDiv = document.getElementById('form-status');
        const fileInput = document.getElementById('votre-cv');
        
        if (fileInput && fileInput.files.length === 0) {
            fileInput.removeAttribute('name');
        }

        const formData = new FormData(form);
        formData.append('_wpcf7', '35');
        formData.append('_wpcf7_version', '5.9');
        formData.append('_wpcf7_locale', 'fr_FR');
        formData.append('_wpcf7_unit_tag', 'wpcf7-f35-o1');

        statusDiv.innerHTML = "<p style='color: #0073aa; font-weight: bold;'>Envoi de votre candidature en cours...</p>";

        try {
            const response = await fetch(`${WpData.rest_url}contact-form-7/v1/contact-forms/35/feedback`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (fileInput) { fileInput.setAttribute('name', 'votre-cv'); }

            if (result.status === 'mail_sent' || result.status === 'mail_failed') {
                statusDiv.innerHTML = `<p style="color:green; font-weight:bold;">Votre message a bien été envoyé. Merci !</p>`;
                form.reset(); 
            } else if (result.status === 'validation_failed') {
                statusDiv.innerHTML = `<p style="color:orange; font-weight:bold;">${result.message}</p>`;
            } else {
                statusDiv.innerHTML = `<p style="color:red; font-weight:bold;">${result.message}</p>`;
            }
        } catch (error) {
            console.error("Erreur technique :", error);
            statusDiv.innerHTML = "<p style='color:red; font-weight:bold;'>Une erreur réseau est survenue.</p>";
            if (fileInput) { fileInput.setAttribute('name', 'votre-cv'); }
        }
    });
};

/**
 * =========================================================================
 * ROUTAGE SPA (ÉCOUTEUR DE CLIC GLOBAL - ADAPTÉ À INDEX.PHP)
 * =========================================================================
 */
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Récupération du texte ET de l'attribut data-section pour être sûr de ne rien rater
    const text = link.textContent.toLowerCase().trim();
    const section = link.getAttribute('data-section') ? link.getAttribute('data-section').toLowerCase() : '';

    if (text.includes('accueil') || section === 'accueil') {
        e.preventDefault();
        window.loadHome();
    } else if (text.includes('services') || section === 'services') {
        e.preventDefault();
        window.loadServices();
    } else if (text.includes('blog') || section === 'blog') {
        e.preventDefault();
        window.loadBlog();
    } else if (text.includes('actualités') || text.includes('actualites') || section === 'actualités' || section === 'actualites') {
        e.preventDefault();
        window.loadNews(); // Déclenche ta superbe vue News Belgique !
    } else if (text.includes('contact') || section === 'contact') {
        e.preventDefault();
        window.loadContact();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.loadHome();
});