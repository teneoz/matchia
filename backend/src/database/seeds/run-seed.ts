import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as argon2 from 'argon2';
import typeormConfig from '../../config/typeorm.config';
import { User } from '../../entities/user.entity';
import { Role } from '../../common/enums/role.enum';

config();

async function runSeed() {
  const dataSource = new DataSource(typeormConfig);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Create admin user
  const adminExists = await userRepository.findOne({ where: { email: 'admin@matchinsight.com' } });
  if (!adminExists) {
    const adminPassword = await argon2.hash('Admin123!@#');
    const admin = userRepository.create({
      email: 'admin@matchinsight.com',
      fullName: 'Administrator',
      password: adminPassword,
      role: Role.ADMIN,
      subscriptionTier: 'premium',
      creditsRemaining: 1000,
      isActive: true,
    });
    await userRepository.save(admin);
    console.log('✅ Admin user created: admin@matchinsight.com / Admin123!@#');
  }

  // Create test user
  const testUserExists = await userRepository.findOne({ where: { email: 'user@matchinsight.com' } });
  if (!testUserExists) {
    const userPassword = await argon2.hash('User123!@#');
    const testUser = userRepository.create({
      email: 'user@matchinsight.com',
      fullName: 'Test User',
      password: userPassword,
      role: Role.USER,
      subscriptionTier: 'free',
      creditsRemaining: 50,
      isActive: true,
    });
    await userRepository.save(testUser);
    console.log('✅ Test user created: user@matchinsight.com / User123!@#');
  }

  await dataSource.destroy();
  console.log('✅ Seed completed successfully!');
}

runSeed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
