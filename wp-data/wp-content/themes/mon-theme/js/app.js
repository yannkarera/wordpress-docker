const loadServices = async () => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    // 1. On prépare la structure de la page (titres de image_3.png)
    contentArea.innerHTML = `
        <div class="services-page">
            <h1 class="page-title">Nos services</h1>
            <h2 class="sub-title">Nos Services de Développement Web</h2>
            <div class="grid-container" id="services-grid"></div>
        </div>
    `;

    const servicesGrid = document.getElementById('services-grid');

    try {
        // 2. Appel à l'API pour le Custom Post Type "service"
        const response = await fetch(`${WpData.rest_url}wp/v2/service?_embed`);
        const services = await response.json();

        servicesGrid.innerHTML = '';

        // 3. On boucle sur "services" (et non "posts")
        services.forEach(service => {
            const imageUrl = service._embedded && service._embedded['wp:featuredmedia']
                ? service._embedded['wp:featuredmedia'][0].source_url
                : 'https://via.placeholder.com/300';

            servicesGrid.innerHTML += `
                <article class="card">
                    <img src="${imageUrl}" alt="${service.title.rendered}">
                    <h3>${service.title.rendered}</h3>
                    <div class="excerpt">${service.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 100)}...</div>
                    <button class="btn-blue" onclick="loadContact()">Nous contacter</button>
                </article>
            `;
        });
    } catch (error) {
        console.error("Erreur API Services :", error);
        servicesGrid.innerHTML = "<p>Erreur lors du chargement des services.</p>";
    }
};


const loadHome = async () => {
    const contentArea = document.getElementById('app-content');

    contentArea.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-banner">
            <div class="hero-content">
                <h1>Bienvenue sur notre site</h1>
                <p>Découvrez nos services, nos actualités et bien plus encore. Nous sommes là pour répondre à vos besoins.</p>
                <a href="#" class="btn-outline" onclick="loadContact()">Nous contacter</a>
            </div>
        </section>

        <!-- À propos -->
        <section class="about-section">
            <h2>À propos de nous</h2>
            <p>Nous offrons des solutions innovantes pour vous accompagner dans votre projet...</p>
        </section>

        <!-- Section Articles -->
        <section class="latest-posts">
            <h2>Nos derniers articles</h2>
            <div class="grid-container" id="home-posts-grid">
                <!-- Les articles seront injectés ici -->
            </div>
        </section>
    `;

    // On réutilise ta logique de fetch pour remplir la home
    loadBlog('home-posts-grid');
};


const loadBlog = async (targetId = null) => {
    const contentArea = document.getElementById('app-content');

    // Si on n'a pas de targetId, on prépare la page complète (vue Blog)
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
        console.error("Erreur API :", error);
    }
};

// 2. La fonction Contact (On y intègre l'écouteur de formulaire)
const loadContact = () => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="contact-container">
            <h1 class="contact-title">Contact</h1>
            <div class="form-card">
                <form id="contact-form">
                    <div class="form-group">
                        <label>Votre Nom (obligatoire)</label>
                        <!-- CHANGEMENT : name="votre-nom" -->
                        <input type="text" name="votre-nom" required>
                    </div>
                    <div class="form-group">
                        <label>Votre Email (obligatoire)</label>
                        <!-- CHANGEMENT : name="votre-email" -->
                        <input type="email" name="votre-email" required>
                    </div>
                    <div class="form-group">
                        <label>Numéro de téléphone (obligatoire)</label>
                        <!-- CHANGEMENT : name="votre-telephone" -->
                        <input type="tel" name="votre-telephone" required>
                    </div>
                    <div class="form-group">
                        <label>Poste auquel vous postulez (obligatoire)</label>
                        <!-- CHANGEMENT : name="poste-occupe" -->
                        <input type="text" name="poste-occupe" required>
                    </div>
                    <div class="form-group">
                        <label>Téléchargez votre CV (PDF, DOC, DOCX, TXT - Max 2MB)</label>
                        <!-- CHANGEMENT : name="votre-cv" -->
                        <input type="file" name="votre-cv" accept=".pdf,.doc,.docx,.txt">
                    </div>
                    <div class="form-group">
                        <label>Pourquoi êtes-vous un bon candidat ? (obligatoire)</label>
                        <!-- CHANGEMENT : name="pourquoi-vous" -->
                        <textarea name="pourquoi-vous" rows="6" required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Envoyer ma candidature</button>
                    <div id="form-status" style="margin-top: 15px;"></div>
                </form>
            </div>
        </div>
    `;

    const form = document.getElementById('contact-form');
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const statusDiv = document.getElementById('form-status');
        const formData = new FormData(form); // Récupère tous les champs, y compris le CV

        statusDiv.innerHTML = "<p style='color: #0073aa;'>Envoi de votre candidature en cours...</p>";

        try {
            // Remplace '123' par ton ID numérique réel
            const response = await fetch(`${WpData.rest_url}contact-form-7/v1/contact-forms/35/feedback`, {
                method: 'POST',
                body: formData // Pas de Header Content-Type ici, le navigateur s'en occupe pour les fichiers
            });

            const result = await response.json();

            if (result.status === 'mail_sent') {
                statusDiv.innerHTML = `<p style="color:green; font-weight:bold;">${result.message}</p>`;
                form.reset(); // Vide le formulaire après succès
            } else {
                // Affiche l'erreur spécifique de validation si CF7 en trouve une
                statusDiv.innerHTML = `<p style="color:red; font-weight:bold;">${result.message}</p>`;
            }
        } catch (error) {
            console.error("Erreur technique :", error);
            statusDiv.innerHTML = "<p style='color:red;'>Une erreur réseau est survenue. Vérifiez votre connexion Docker.</p>";
        }
    });
};

// 3. L'écouteur de clic Global
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const text = link.textContent.toLowerCase().trim();

    if (text === 'accueil') {
        e.preventDefault();
        loadHome();
    } else if (text.includes('services')) {
        e.preventDefault();
        loadServices();
    } else if (text.includes('blog')) {
        e.preventDefault();
        loadBlog();
    } else if (text.includes('contact')) {
        e.preventDefault();
        loadContact();
    }
});
// Lance l'accueil automatiquement dès que le script est chargé
document.addEventListener('DOMContentLoaded', () => {
    loadHome();
});