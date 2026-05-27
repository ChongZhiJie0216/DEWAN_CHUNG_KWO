document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const headers = document.querySelectorAll('th[data-sort]');
    
    const enhancedData = patchData.map(fixture => {
        let universe = parseInt(fixture.address.split('.')[0]) || 0;
        if (universe > 0) universe -= 1;
        return { ...fixture, universe };
    });
    
    let currentData = [...enhancedData];
    let sortColumn = 'userNo';
    let sortAscending = true;

    // Initial render
    renderTable();

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        currentData = enhancedData.filter(fixture => 
            fixture.legend.toLowerCase().includes(term) ||
            fixture.mode.toLowerCase().includes(term) ||
            fixture.fixture.toLowerCase().includes(term) ||
            fixture.universe.toString() === term
        );
        sortData();
        renderTable();
    });

    // Sorting functionality
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            if (sortColumn === column) {
                sortAscending = !sortAscending;
            } else {
                sortColumn = column;
                sortAscending = true;
            }
            updateSortIcons();
            sortData();
            renderTable();
        });
    });

    function sortData() {
        currentData.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];
            
            // Numeric sorting for User No and Universe
            if (sortColumn === 'userNo' || sortColumn === 'universe') {
                valA = parseInt(valA) || 0;
                valB = parseInt(valB) || 0;
            }
            
            if (valA < valB) return sortAscending ? -1 : 1;
            if (valA > valB) return sortAscending ? 1 : -1;
            return 0;
        });
    }

    function updateSortIcons() {
        headers.forEach(header => {
            const icon = header.querySelector('i');
            if (header.dataset.sort === sortColumn) {
                icon.setAttribute('data-lucide', sortAscending ? 'chevron-up' : 'chevron-down');
                icon.style.opacity = '1';
                icon.style.color = 'var(--accent-cyan)';
            } else {
                icon.setAttribute('data-lucide', 'chevrons-up-down');
                icon.style.opacity = '0.5';
                icon.style.color = 'inherit';
            }
        });
        lucide.createIcons();
    }

    function renderTable() {
        tableBody.innerHTML = '';
        
        if (currentData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No fixtures found.</td></tr>`;
            return;
        }

        currentData.forEach(fixture => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${fixture.userNo}</strong></td>
                <td>${fixture.fixture}</td>
                <td><span class="badge badge-mode">${fixture.mode}</span></td>
                <td><span class="badge badge-universe">Univ ${fixture.universe}</span></td>
                <td><span class="badge badge-address">${fixture.address}</span></td>
                <td><strong>${fixture.legend}</strong></td>
                <td>${fixture.location}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
