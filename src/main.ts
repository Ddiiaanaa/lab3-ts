interface Category {
    id: number;
    name: string;
    shortname: string;
    notes: string;
}

interface Product {
    id: number;
    name: string;
    shortname: string;
    description: string;
    price: string;
}

const appContent = document.getElementById('app-content') as HTMLDivElement;
const catalogLink = document.getElementById('catalog-link') as HTMLAnchorElement;

async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function renderCatalog(): Promise<void> {
    appContent.innerHTML = '<p>Завантаження каталогу...</p>';

    try {
        const categories = await fetchData<Category[]>('./data/categories.json');
        let html = '<h2>Каталог товарів</h2><div class="list-group mb-4">';
        
        categories.forEach(cat => {
            html += `<a href="#" class="list-group-item list-group-item-action category-link" data-shortname="${cat.shortname}">
                        <h5 class="mb-1">${cat.name}</h5>
                        <small>${cat.notes}</small>
                     </a>`;
        });
        html += '</div>';
        
        html += `<button id="specials-btn" class="btn btn-warning">Сюрприз (Specials)</button>`;

        appContent.innerHTML = html;

        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLAnchorElement;
                const shortname = target.getAttribute('data-shortname');
                if (shortname) {
                    renderCategoryItems(shortname, categories.find(c => c.shortname === shortname)?.name || '');
                }
            });
        });

        const specialsBtn = document.getElementById('specials-btn') as HTMLButtonElement;
        specialsBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];
if (randomCategory) {
    renderCategoryItems(randomCategory.shortname, randomCategory.name);
}        });

    } catch (error) {
        appContent.innerHTML = `<p class="text-danger">Помилка завантаження каталогу.</p>`;
        console.error(error);
    }
}

async function renderCategoryItems(categoryShortname: string, categoryName: string): Promise<void> {
    appContent.innerHTML = '<p>Завантаження товарів...</p>';

    try {
        const products = await fetchData<Product[]>(`./data/${categoryShortname}.json`);
        let html = `<h2>Категорія: ${categoryName}</h2>`;
        html += `<div class="row">`;

        products.forEach(prod => {
            html += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="https://placehold.co/200x200" class="card-img-top" alt="${prod.name}">
                    <div class="card-body">
                        <h5 class="card-title">${prod.name}</h5>
                        <p class="card-text text-muted">${prod.shortname}</p>
                        <p class="card-text">${prod.description}</p>
                        <h6 class="card-subtitle mb-2 text-primary">Ціна: ${prod.price}</h6>
                    </div>
                </div>
            </div>`;
        });
        
        html += `</div>`;
        html += `<button id="back-to-catalog" class="btn btn-secondary mt-3">Назад до каталогу</button>`;
        appContent.innerHTML = html;

        const backBtn = document.getElementById('back-to-catalog') as HTMLButtonElement;
        backBtn.addEventListener('click', renderCatalog);

    } catch (error) {
         appContent.innerHTML = `<p class="text-danger">Помилка завантаження товарів (можливо файл ${categoryShortname}.json не існує).</p>`;
    }
}
catalogLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    renderCatalog();    
});