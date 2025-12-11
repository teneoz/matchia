/**
 * Script pour récupérer les utilisateurs depuis Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jvzqfowyaksyweleblyk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hDnlSTzlj-2Zq0QDLGilGA_d0QRmjZT';

async function getUsers() {
  console.log('🔍 Récupération des utilisateurs depuis Supabase...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Récupérer les profils (table publique)
  console.log('📊 Récupération des profils (table profiles)...');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('❌ Erreur:', profilesError.message);
    return;
  }

  console.log(`✅ ${profiles?.length || 0} profil(s) trouvé(s)\n`);

  if (profiles && profiles.length > 0) {
    console.log('👥 Liste des profils:');
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. ${profile.email || 'N/A'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Nom: ${profile.full_name || 'N/A'}`);
      console.log(`   Tier: ${profile.subscription_tier}`);
      console.log(`   Crédits: ${profile.credits_remaining}`);
      console.log(`   Créé le: ${new Date(profile.created_at).toLocaleString('fr-FR')}`);
    });
  } else {
    console.log('ℹ️  Aucun profil trouvé. La table est vide.');
    console.log('   Les profils sont créés automatiquement lors de l\'inscription d\'un utilisateur.');
  }

  // Note sur auth.users
  console.log('\n📝 Note:');
  console.log('   Pour récupérer les utilisateurs depuis auth.users,');
  console.log('   vous devez utiliser SUPABASE_SERVICE_ROLE_KEY dans .env.local');
  console.log('   et utiliser adminClient.auth.admin.listUsers()');
}

getUsers();

