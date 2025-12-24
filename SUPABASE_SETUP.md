# Configuration Supabase - Guide Rapide

## ✅ Ce qui a été fait

1. **Installation du client Supabase** : `@supabase/supabase-js`
2. **Configuration des variables d'environnement** : `.env.local` créé avec vos clés
3. **Client Supabase** : `src/lib/supabase.ts` - connexion configurée
4. **Types TypeScript** : `src/lib/database.types.ts` - types pour la base de données
5. **Fonctions CRUD** : `src/lib/database.ts` - toutes les opérations (ajout, modification, suppression, import)
6. **Mise à jour de l'application** : `App.tsx` utilise maintenant la base de données au lieu de l'état local

## 🗄️ Schéma de la table `garments`

Exécutez ce SQL dans votre dashboard Supabase (SQL Editor) :

```sql
CREATE TABLE garments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_garments_category ON garments(category);
CREATE INDEX idx_garments_brand ON garments(brand);
CREATE INDEX idx_garments_serial_number ON garments(serial_number);

ALTER TABLE garments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON garments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON garments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON garments
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON garments
  FOR DELETE USING (true);
```

## 🚀 Comment tester

1. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Importez votre fichier Excel** - Les données seront maintenant sauvegardées dans Supabase

3. **Rafraîchissez la page** - Les données resteront !

## 📝 Notes importantes

- Les données sont maintenant **persistantes** dans Supabase
- Chaque ajout, modification ou suppression est **immédiatement sauvegardé**
- L'import Excel fonctionne toujours et sauvegarde dans la base
- Les politiques RLS sont configurées en mode public (à ajuster si vous ajoutez l'authentification)

## 🔒 Sécurité

Pour le moment, la base est accessible publiquement (lecture/écriture). Si vous voulez restreindre l'accès :
1. Ajoutez l'authentification Supabase
2. Modifiez les politiques RLS pour vérifier `auth.uid()`
