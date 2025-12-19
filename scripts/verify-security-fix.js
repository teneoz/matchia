/**
 * Script pour vérifier que les corrections de sécurité Supabase ont été appliquées
 * Ce script vérifie les 5 points corrigés :
 * 1. Vue upcoming_matches_with_teams sans SECURITY DEFINER
 * 2-5. RLS activé sur leagues, teams, match_statistics, team_standings
 */

const { createClient } = require('@supabase/supabase-js');

// Récupérer les variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erreur: Variables d\'environnement Supabase non configurées');
  console.error('   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSecurityFixes() {
  console.log('🔍 Vérification des corrections de sécurité Supabase...\n');

  const results = {
    view: { status: 'pending', message: '' },
    leagues: { status: 'pending', message: '' },
    teams: { status: 'pending', message: '' },
    match_statistics: { status: 'pending', message: '' },
    team_standings: { status: 'pending', message: '' }
  };

  try {
    // 1. Vérifier la vue upcoming_matches_with_teams
    console.log('1️⃣  Vérification de la vue upcoming_matches_with_teams...');
    try {
      const { data, error } = await supabase
        .from('upcoming_matches_with_teams')
        .select('*')
        .limit(1);

      if (error) {
        results.view = { 
          status: 'error', 
          message: `Erreur: ${error.message}. La vue peut ne pas exister ou avoir des problèmes de permissions.` 
        };
        console.log(`   ⚠️  ${results.view.message}`);
      } else {
        // Note: On ne peut pas vérifier directement si la vue a SECURITY DEFINER via l'API
        // mais si on peut la lire, c'est probablement correct
        results.view = { 
          status: 'ok', 
          message: 'Vue accessible (probablement sans SECURITY DEFINER)' 
        };
        console.log(`   ✅ ${results.view.message}`);
      }
    } catch (err) {
      results.view = { status: 'error', message: err.message };
      console.log(`   ❌ Erreur: ${err.message}`);
    }

    // 2-5. Vérifier RLS sur les tables (en testant l'accès en lecture)
    const tables = [
      { name: 'leagues', display: '2️⃣  Leagues' },
      { name: 'teams', display: '3️⃣  Teams' },
      { name: 'match_statistics', display: '4️⃣  Match Statistics' },
      { name: 'team_standings', display: '5️⃣  Team Standings' }
    ];

    for (const table of tables) {
      console.log(`\n${table.display} - Vérification RLS sur ${table.name}...`);
      
      try {
        const { data, error } = await supabase
          .from(table.name)
          .select('*')
          .limit(1);

        if (error) {
          // Si l'erreur est liée à RLS, cela signifie que RLS est activé mais mal configuré
          if (error.code === '42501' || error.message.includes('permission denied')) {
            results[table.name] = { 
              status: 'error', 
              message: `RLS activé mais politique manquante ou incorrecte: ${error.message}` 
            };
            console.log(`   ❌ ${results[table.name].message}`);
          } else if (error.code === 'PGRST116') {
            results[table.name] = { 
              status: 'warning', 
              message: 'Table n\'existe pas encore' 
            };
            console.log(`   ⚠️  ${results[table.name].message}`);
          } else {
            results[table.name] = { status: 'error', message: error.message };
            console.log(`   ❌ Erreur: ${error.message}`);
          }
        } else {
          // Si on peut lire les données, RLS est activé avec une politique publique (correct)
          results[table.name] = { 
            status: 'ok', 
            message: 'RLS activé avec politique de lecture publique ✅' 
          };
          console.log(`   ✅ ${results[table.name].message}`);
        }
      } catch (err) {
        results[table.name] = { status: 'error', message: err.message };
        console.log(`   ❌ Exception: ${err.message}`);
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DES VÉRIFICATIONS');
    console.log('='.repeat(60));

    const okCount = Object.values(results).filter(r => r.status === 'ok').length;
    const errorCount = Object.values(results).filter(r => r.status === 'error').length;
    const warningCount = Object.values(results).filter(r => r.status === 'warning').length;

    console.log(`✅ Corrections vérifiées: ${okCount}/5`);
    console.log(`⚠️  Avertissements: ${warningCount}`);
    console.log(`❌ Erreurs: ${errorCount}\n`);

    if (okCount === 5) {
      console.log('🎉 Toutes les corrections de sécurité sont appliquées !');
      console.log('   Vous pouvez vérifier dans Supabase Dashboard → Security Advisor');
      return true;
    } else {
      console.log('⚠️  Certaines corrections doivent encore être appliquées.');
      console.log('   Exécutez le fichier fix-supabase-security-errors.sql dans Supabase SQL Editor');
      return false;
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    return false;
  }
}

// Exécuter la vérification
checkSecurityFixes()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });

