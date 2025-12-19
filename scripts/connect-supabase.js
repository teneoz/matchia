/**
 * Script pour tester la connexion Supabase avec les credentials fournis
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jvzqfowyaksyweleblyk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT';

async function testConnection() {
  console.log('🔌 Connexion à Supabase...');
  console.log(`   URL: ${SUPABASE_URL}\n`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Test 1: Récupérer les profils
    console.log('📊 Récupération des profils...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);

    if (profilesError) {
      console.error('❌ Erreur lors de la récupération des profils:', profilesError.message);
      console.error('   Code:', profilesError.code);
      console.error('   Détails:', profilesError.details);
    } else {
      console.log(`✅ ${profiles?.length || 0} profil(s) trouvé(s)`);
      if (profiles && profiles.length > 0) {
        console.log('\nProfils:');
        profiles.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.email || 'N/A'} (${profile.id})`);
          console.log(`     - Nom: ${profile.full_name || 'N/A'}`);
          console.log(`     - Tier: ${profile.subscription_tier || 'N/A'}`);
          console.log(`     - Crédits: ${profile.credits_remaining || 0}`);
        });
      } else {
        console.log('   Aucun profil trouvé dans la table.');
      }
    }

    // Test 2: Vérifier si la table existe
    console.log('\n🔍 Vérification de la structure de la base de données...');
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (tablesError && tablesError.code === 'PGRST116') {
      console.log('⚠️  La table "profiles" n\'existe pas encore.');
      console.log('   Exécutez le fichier database-schema.sql dans Supabase SQL Editor.');
    }

    console.log('\n✅ Test de connexion terminé !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testConnection();





