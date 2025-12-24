import * as XLSX from 'xlsx';
import type { Garment } from '../types';

/**
 * Parser for the specific Excel format provided.
 * A: Marque
 * B: Type (Category)
 * C: Article
 * D: Model
 * E: Couleur
 * F-AD: Tailles (Stock counts)
 * AE: Prix/u achat
 */

export const parseExcelStock = (buffer: ArrayBuffer): Garment[] => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' }) as any[];

    const garments: Garment[] = [];
    const sizeColumns: { [key: string]: string } = {};

    // Find the header row (row 2)
    const sizeHeadersRow = rawData.find(row => row['F'] === 30 || row['F'] === '30');
    if (sizeHeadersRow) {
        Object.keys(sizeHeadersRow).forEach(key => {
            const val = sizeHeadersRow[key];
            if (val && !isNaN(Number(val)) && key.length <= 2) {
                sizeColumns[key] = String(val);
            }
        });
    }

    rawData.forEach((row, index) => {
        // Skipping header rows
        if (index < 2) return;

        const brand = row['A'];
        const type = row['B']; // Raw type from Excel used as dynamic category
        const serial = row['C'];
        const model = row['D'] || '';
        const color = row['E'] || 'Standard';

        let priceVal = row['AE'];
        if (typeof priceVal === 'string') {
            priceVal = parseFloat(priceVal.replace(/[^\d.,]/g, '').replace(',', '.'));
        }
        const price = parseFloat(priceVal) || 0;

        if (!brand || (!type && !serial)) return;

        // Check all possible size columns
        Object.keys(sizeColumns).forEach(colKey => {
            const stock = parseInt(row[colKey]);
            if (!isNaN(stock) && stock > 0) {
                const size = sizeColumns[colKey];
                garments.push({
                    id: Math.random().toString(36).substr(2, 9),
                    serialNumber: String(serial || model || 'N/A'),
                    name: `${type || ''} ${brand} ${model}`.trim(),
                    brand: String(brand),
                    model: String(model),
                    category: String(type || 'Autre'), // Dynamic category
                    size: size,
                    color: String(color),
                    price: price,
                    currentStock: stock,

                    dateAdded: new Date().toISOString().split('T')[0]
                });
            }
        });
    });

    return garments;
};
