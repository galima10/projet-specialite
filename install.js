const { exec } = require('child_process');
const path = require('path');

function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    const process = exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
    process.stdout.pipe(process.stdout);
    process.stderr.pipe(process.stderr);
  });
}

async function main() {
  try {
    console.log('🚀 Lancement de l’installation Frontend et Backend en parallèle...');

    await Promise.all([
      runCommand('npm install', path.join(__dirname, 'frontend')),
      runCommand('composer install', path.join(__dirname, 'backend'))
    ]);

    console.log('✅ Installation terminée !');
  } catch (err) {
    console.error('❌ Une erreur est survenue.', err);
    process.exit(1);
  }
}

main();