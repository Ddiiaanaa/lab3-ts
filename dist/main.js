var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const appContent = document.getElementById('app-content');
const catalogLink = document.getElementById('catalog-link');
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}
function renderCatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        appContent.innerHTML = '<p>Завантаження каталогу...</p>';
        try {
            const categories = yield fetchData('./data/categories.json');
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
                    var _a;
                    e.preventDefault();
                    const target = e.currentTarget;
                    const shortname = target.getAttribute('data-shortname');
                    if (shortname) {
                        renderCategoryItems(shortname, ((_a = categories.find(c => c.shortname === shortname)) === null || _a === void 0 ? void 0 : _a.name) || '');
                    }
                });
            });
            const specialsBtn = document.getElementById('specials-btn');
            specialsBtn.addEventListener('click', () => {
                const randomIndex = Math.floor(Math.random() * categories.length);
                const randomCategory = categories[randomIndex];
                if (randomCategory) {
                    renderCategoryItems(randomCategory.shortname, randomCategory.name);
                }
            });
        }
        catch (error) {
            appContent.innerHTML = `<p class="text-danger">Помилка завантаження каталогу.</p>`;
            console.error(error);
        }
    });
}
function renderCategoryItems(categoryShortname, categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        appContent.innerHTML = '<p>Завантаження товарів...</p>';
        try {
            const products = yield fetchData(`./data/${categoryShortname}.json`);
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
            const backBtn = document.getElementById('back-to-catalog');
            backBtn.addEventListener('click', renderCatalog);
        }
        catch (error) {
            appContent.innerHTML = `<p class="text-danger">Помилка завантаження товарів (можливо файл ${categoryShortname}.json не існує).</p>`;
        }
    });
}
catalogLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderCatalog();
});
export {};
//# sourceMappingURL=main.js.map