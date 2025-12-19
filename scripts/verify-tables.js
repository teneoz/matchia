/**
 * Script pour vérifier que toutes les tables Supabase existent
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jvzqfowyaksyweleblyk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT';

const tables = [
  'profiles',
  'teams',
  'leagues',
  'matches',
  'match_statistics',
  'team_standings',
  'predictions',
  'user_favorites',
  'credit_transactions'
];

async function verifyTables() {
  console.log('🔍 Vérification des tables Supabase...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const results = {
    existing: [],
    missing: [],
    errors: []
  };

  for (const table of tables) {
    try {
      // Essayer de faire un SELECT sur la table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          results.missing.push(table);
          console.log(`❌ ${table} - Table n'existe pas`);
        } else {
          results.errors.push({ table, error: error.message });
          console.log(`⚠️  ${table} - Erreur: ${error.message}`);
        }
      } else {
        results.existing.push(table);
        console.log(`✅ ${table} - Table existe (${data?.length || 0} ligne(s))`);
      }
    } catch (err) {
      results.errors.push({ table, error: err.message });
      console.log(`❌ ${table} - Exception: ${err.message}`);
    }
  }

  console.log('\n📊 Résumé:');
  console.log(`   ✅ Tables existantes: ${results.existing.length}/${tables.length}`);
  console.log(`   ❌ Tables manquantes: ${results.missing.length}`);
  console.log(`   ⚠️  Erreurs: ${results.errors.length}`);

  if (results.existing.length === tables.length) {
    console.log('\n🎉 Toutes les tables sont créées avec succès !');
  } else if (results.missing.length > 0) {
    console.log('\n⚠️  Tables manquantes:');
    results.missing.forEach(table => console.log(`   - ${table}`));
    console.log('\n💡 Assurez-vous d\'avoir exécuté tout le contenu de database-schema.sql');
  }

  return results;
}

verifyTables();





