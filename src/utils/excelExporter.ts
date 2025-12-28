import * as XLSX from 'xlsx';
import type { Garment } from '../types';

export const exportToExcel = (garments: Garment[]) => {
    // 1. Group garments by key attributes (excluding size and stock)
    const grouped: { [key: string]: any } = {};

    garments.forEach(g => {
        const key = `${g.brand}-${g.category}-${g.serialNumber}-${g.model}-${g.color}-${g.price}`;
        if (!grouped[key]) {
            grouped[key] = {
                brand: g.brand,
                type: g.category,
                article: g.serialNumber,
                model: g.model,
                color: g.color,
                price: g.price,
                stocks: {} // size -> stock mapping
            };
        }
        grouped[key].stocks[g.size] = g.currentStock;
    });

    // 2. Prepare spreadsheet data starting from row 3 (JS is 0-indexed, so row 2)
    const data: any[] = [];

    // Header Row 1 (Titles)
    const header1: any = {
        A: 'Marque',
        B: 'Type',
        C: 'Article',
        D: 'Model',
        E: 'Couleur',
        F: 'Taille',
        AE: 'Prix/u achat',
        AF: 'Prix total'
    };
    data.push(header1);

    // Header Row 2 (Sizes)
    const header2: any = {};
    const sizeColumns: string[] = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '48', '50', '52', '54', '56', '58', '60', '62'];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const cols = [...alphabet, 'AA', 'AB', 'AC', 'AD']; // F is index 5, AD is 29 (30 columns total)

    sizeColumns.forEach((size, idx) => {
        const colKey = cols[idx + 5]; // Start at F (index 5)
        header2[colKey] = size;
    });
    data.push(header2);

    // 3. Mapping data rows
    Object.values(grouped).forEach(item => {
        const row: any = {
            A: item.brand,
            B: item.type,
            C: item.article,
            D: item.model,
            E: item.color,
            AE: `${item.price}€`
        };

        let totalStock = 0;
        sizeColumns.forEach((size, idx) => {
            const colKey = cols[idx + 5];
            const stock = item.stocks[size] || '';
            row[colKey] = stock;
            if (stock) totalStock += stock;
        });

        row.AF = `${item.price * totalStock}€`;
        data.push(row);
    });

    // 4. Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });

    // Set column numbering mapping (A=0, B=1, etc.)
    // We used json_to_sheet with custom keys (A, B, C...) which works well with skipHeader

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');

    // 5. Generate and download
    XLSX.writeFile(workbook, `Stock_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
};
