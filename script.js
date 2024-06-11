function getColor(value) {
    if (value === 0) return ''; // No color for zero values
    else if (value <= 10) return '#a6f4de';
    else if (value <= 250) return '#4df0c4';
    else if (value <= 400) return '#09d2ab'; // Mid green
    else if (value <= 500) return '#f9ed69'; // Light yellow
    else if (value <= 750) return '#f4e04d'; // Yellow
    else if (value <= 1000) return '#ecc802'; // Dark yellow
    else if (value <= 2000) return '#ffcfdf';
    else if (value <= 3000) return '#ff9baf';
    else if (value <= 5000) return '#ff798f';
    else if (value <= 7500) return '#ff576f';
    else if (value <= 9000) return '#ff354f';
    else if (value <= 10000) return '#ff1330'; // Light red
    else return '#e6102b'; // Hottest red
}

function formatNumber(number) {
    return number.toLocaleString();
}

function showModels(brand) {
    const modelsList = document.getElementById('modelsList');
    modelsList.innerHTML = ''; // Очищення попередніх моделей

    const tableTitle = document.getElementById('tableTitle');
    const totalCars = carModels[brand].models.reduce((sum, model) => {
        return sum + Object.values(carModels[brand].data[model]).reduce((a, b) => a + b, 0);
    }, 0);
    tableTitle.textContent = `${brand} (${formatNumber(totalCars)} cars)`;

    const years = Array.from(new Set(carModels[brand].models.flatMap(model => Object.keys(carModels[brand].data[model])))).sort((a, b) => b - a);
    let totalByYear = years.reduce((acc, year) => { acc[year] = 0; return acc; }, {});
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Brand\\Years</th>
                    ${years.map(year => `<th>${year}</th>`).join('')}
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    carModels[brand].models.forEach((model) => {
        const totals = years.map(year => carModels[brand].data[model][year] || 0);
        const totalModels = totals.reduce((acc, val) => acc + val, 0);

        tableHtml += `
            <tr>
                <td class="left-highlighted">${model}</td>
                ${totals.map(total => {
                    const color = getColor(total);
                    return `<td${color ? ` style="background-color: ${color};"` : ''}>${total > 0 ? total : ''}</td>`;
                }).join('')}
                <td class="right-highlighted">${totalModels}</td>
            </tr>
        `;

        totals.forEach((count, index) => {
            totalByYear[years[index]] += count;
        });
    });

    const totalModelsOverall = Object.values(totalByYear).reduce((acc, val) => acc + val, 0);

    tableHtml += `</tbody>
            <tfoot>
                <tr>
                    <td class="left-highlighted">total</td>
                    ${years.map(year => `<td>${totalByYear[year]}</td>`).join('')}
                    <td class="right-highlighted">${totalModelsOverall}</td>
                </tr>
            </tfoot>
        </table>`;
    modelsList.innerHTML = tableHtml;
    highlightActiveButton(brand);
}

function showAllModels() {
    const modelsList = document.getElementById('modelsList');
    modelsList.innerHTML = ''; // Очищення попередніх моделей

    const tableTitle = document.getElementById('tableTitle');
    const totalCars = Object.values(carModels).reduce((sum, brand) => {
        return sum + brand.models.reduce((brandSum, model) => {
            return brandSum + Object.values(brand.data[model]).reduce((a, b) => a + b, 0);
        }, 0);
    }, 0);
    tableTitle.textContent = `ALL BRANDS (${formatNumber(totalCars)} cars)`;

    const allYears = new Set();
    for (const brand in carModels) {
        carModels[brand].models.forEach(model => {
            Object.keys(carModels[brand].data[model]).forEach(year => allYears.add(year));
        });
    }
    const years = Array.from(allYears).sort((a, b) => b - a);
    let totalByYear = years.reduce((acc, year) => { acc[year] = 0; return acc; }, {});
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Brand\\Years</th>
                    ${years.map(year => `<th>${year}</th>`).join('')}
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    const brands = [];

    for (const brand in carModels) {
        const totals = years.map(year => {
            return carModels[brand].models.reduce((sum, model) => sum + (carModels[brand].data[model][year] || 0), 0);
        });
        const totalModels = totals.reduce((acc, val) => acc + val, 0);
        brands.push({ name: brand, totals: totals, totalModels: totalModels });
    }

    // Сортуємо бренди за загальною кількістю моделей у порядку спадання
    brands.sort((a, b) => b.totalModels - a.totalModels);

    brands.forEach(brand => {
        tableHtml += `
            <tr>
                <td class="left-highlighted">${brand.name}</td>
                ${brand.totals.map(total => {
                    const color = getColor(total);
                    return `<td${color ? ` style="background-color: ${color};"` : ''}>${total > 0 ? total : ''}</td>`;
                }).join('')}
                <td class="right-highlighted">${brand.totalModels}</td>
            </tr>
        `;
        brand.totals.forEach((count, index) => {
            totalByYear[years[index]] += count;
        });
    });

    const totalModelsOverall = Object.values(totalByYear).reduce((acc, val) => acc + val, 0);

    tableHtml += `</tbody>
            <tfoot>
                <tr>
                    <td class="left-highlighted">total</td>
                    ${years.map(year => `<td>${totalByYear[year]}</td>`).join('')}
                    <td class="right-highlighted">${totalModelsOverall}</td>
                </tr>
            </tfoot>
        </table>`;
    modelsList.innerHTML = tableHtml;
    highlightActiveButton('ALL BRANDS');
}

function highlightActiveButton(activeBrand) {
    const buttons = document.querySelectorAll('#brands .brand');
    buttons.forEach(button => {
        if (button.textContent.includes(activeBrand)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function initializeBrands() {
    const brandsDiv = document.getElementById('brands');
    const brands = [];

    for (const brand in carModels) {
        const total = Object.values(carModels[brand].data).reduce((acc, model) => acc + Object.values(model).reduce((sum, num) => sum + num, 0), 0);
        brands.push({ name: brand, total: total });
    }

    // Сортуємо бренди за кількістю автомобілів у порядку спадання
    brands.sort((a, b) => b.total - a.total);

    // Додаємо відсортовані бренди в DOM
    brands.forEach(brand => {
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand';
        brandDiv.onclick = () => showModels(brand.name);
        brandDiv.innerHTML = `${brand.name} (${formatNumber(brand.total)})`;
        brandsDiv.appendChild(brandDiv);
    });

    // Додаємо обробник подій для заголовка "ALL BRANDS"
    const brandsHeader = document.getElementById('brandsHeader');
    brandsHeader.onclick = showAllModels;
}

// Initial call to display brands
document.addEventListener('DOMContentLoaded', initializeBrands);
