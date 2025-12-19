/**
 * Script pour tester la connexion Supabase et récupérer les utilisateurs
 * Usage: npx tsx scripts/test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testSupabaseConnection() {
  // Utiliser SUPABASE_URL et SUPABASE_ANON_KEY ou les variantes NEXT_PUBLIC
  const supabaseUrl = 
    process.env.SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const supabaseAnonKey = 
    process.env.SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erreur: Variables d\'environnement Supabase non configurées');
    console.log('\nVeuillez définir dans .env.local:');
    console.log('  SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL');
    console.log('  SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('🔌 Connexion à Supabase...');
  console.log(`   URL: ${supabaseUrl.replace(/\/$/, '')}`);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test 1: Récupérer les profils (table publique)
    console.log('\n📊 Récupération des profils...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);

    if (profilesError) {
      console.error('❌ Erreur lors de la récupération des profils:', profilesError.message);
    } else {
      console.log(`✅ ${profiles?.length || 0} profil(s) trouvé(s)`);
      if (profiles && profiles.length > 0) {
        console.log('\nProfils:');
        profiles.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.email} (${profile.id})`);
          console.log(`     - Nom: ${profile.full_name || 'N/A'}`);
          console.log(`     - Tier: ${profile.subscription_tier}`);
          console.log(`     - Crédits: ${profile.credits_remaining}`);
        });
      }
    }

    // Test 2: Essayer de récupérer depuis auth.users (nécessite service_role key)
    console.log('\n👤 Tentative de récupération des utilisateurs auth...');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();

      if (usersError) {
        console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError.message);
      } else {
        console.log(`✅ ${users?.users?.length || 0} utilisateur(s) trouvé(s) dans auth.users`);
        if (users?.users && users.users.length > 0) {
          console.log('\nUtilisateurs auth:');
          users.users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.email} (${user.id})`);
            console.log(`     - Créé: ${user.created_at}`);
            console.log(`     - Dernière connexion: ${user.last_sign_in_at || 'Jamais'}`);
          });
        }
      }
    } else {
      console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY non configuré - impossible de récupérer auth.users');
      console.log('   Utilisez la table profiles à la place (accessible avec anon key)');
    }

    console.log('\n✅ Connexion Supabase réussie !');
  } catch (error) {
    console.error('❌ Erreur:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Exécuter le script
testSupabaseConnection();





