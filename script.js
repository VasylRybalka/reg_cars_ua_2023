function getColor(value) {
    if (value === 0) return ''; // No color for zero values
if (value == 1) return '#a6f4de'; // Light green
else if (value <= 9) return '#86e8c6'; // Lighter green
else if (value <= 49) return '#4df0c4'; // Green
else if (value <= 99) return '#09d2ab'; // Dark green


else if (value <= 199) return '#f9ed69'; // Light yellow
else if (value <= 499) return '#f6e254'; // Lighter yellow
else if (value <= 749) return '#f4e04d'; // Yellow
else if (value <= 999) return '#ecc802'; // Dark yellow


else if (value <= 1999) return '#ffcfdf'; // Light pink
else if (value <= 2999) return '#ffb7c7'; // Light pink-red
else if (value <= 3999) return '#ff9fb0'; // Pink-red
else if (value <= 4999) return '#ff8798'; // Mid pink-red
else if (value <= 5999) return '#ff6f80'; // Darker pink-red
else if (value <= 6999) return '#ff5768'; // Light red
else if (value <= 7999) return '#ff3f50'; // Red
else if (value <= 8999) return '#ff2738'; // Dark red
else if (value <= 9999) return '#ff0f20'; // Darker red
else if (value <= 10000) return '#e0001e'; // Darkest red

    else return '#e0001e'; // Darkest red
}

function formatNumber(number) {
    return number.toLocaleString();
}

function showModels(brand) {
    const modelsList = document.getElementById('modelsList');
    modelsList.innerHTML = '';

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
    modelsList.innerHTML = '';

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

    brands.sort((a, b) => b.total - a.total);

    brands.forEach(brand => {
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand';
        brandDiv.onclick = () => showModels(brand.name);
        brandDiv.innerHTML = `${brand.name} (${formatNumber(brand.total)})`;
        brandsDiv.appendChild(brandDiv);
    });

    const brandsHeader = document.getElementById('brandsHeader');
    brandsHeader.onclick = showAllModels;
}

document.addEventListener('DOMContentLoaded', initializeBrands);
