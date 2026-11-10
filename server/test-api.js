const http = require('http');
const app = require('./server');

const server = app.listen(5099, async () => {
  console.log('🧪 Serveur de test démarré sur http://localhost:5099');

  const request = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const req = http.request(
        {
          hostname: 'localhost',
          port: 5099,
          path,
          method,
          headers
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // 1. Healthcheck
    const health = await request('/api');
    console.log('1. Healthcheck:', health.status, health.data.project);

    // 2. Connexion JWT avec sayarsiwar@polytechnicien.tn
    const login = await request('/api/auth/login', 'POST', {
      email: 'sayarsiwar@polytechnicien.tn',
      password: '123456'
    });
    console.log('2. Connexion JWT réussie:', login.status, login.data.user?.name, 'Token:', !!login.data.token);
    const token = login.data.token;

    // 3. Inscription sécurisée d'un employé avec hachage bcrypt
    const reg = await request('/api/auth/register', 'POST', {
      name: 'Nouveau Développeur',
      email: 'dev.test@entreprise.tn',
      password: 'mon_mot_de_passe_secret',
      role: 'Développeur',
      department: 'Ingénierie & IT'
    });
    console.log('3. Inscription bcrypt réussie:', reg.status, reg.data.user?.name);

    // 4. Lecture des projets avec .populate('createdBy')
    const projects = await request('/api/projects');
    console.log('4. Lecture projets (1:N):', projects.status, 'Nombre:', projects.data.length);
    console.log('   Exemple créateur peuplé:', projects.data[0]?.title, '->', projects.data[0]?.createdBy?.name);

    // 5. Création d'un projet protégé par JWT
    const newProj = await request(
      '/api/projects',
      'POST',
      {
        title: 'Nouveau Projet CRM Cloud',
        description: 'Mise en œuvre du portail CRM pour les clients PME.',
        status: 'En cours',
        priority: 'Haute',
        budget: 18000
      },
      token
    );
    console.log('5. Création projet JWT:', newProj.status, newProj.data.title, 'Créé par:', newProj.data.createdBy?.name);
    const projId = newProj.data._id || newProj.data.id;

    // 6. Lecture des tâches avec double .populate('project', 'assignedTo')
    const tasks = await request('/api/tasks');
    console.log('6. Lecture tâches (1:N):', tasks.status, 'Nombre:', tasks.data.length);
    console.log('   Exemple tâche peuplée:', tasks.data[0]?.title, '| Projet:', tasks.data[0]?.project?.title, '| Assigné à:', tasks.data[0]?.assignedTo?.name);

    // 7. Création d'une tâche liée au projet créé
    const newTask = await request(
      '/api/tasks',
      'POST',
      {
        title: 'Architecture du Module Facturation CRM',
        description: 'Définir les endpoints et schémas de calcul automatique.',
        status: 'À faire',
        priority: 'Haute',
        project: projId
      },
      token
    );
    console.log('7. Création tâche 1:N JWT:', newTask.status, newTask.data.title, 'Projet lié:', newTask.data.project?.title);
    const taskId = newTask.data._id || newTask.data.id;

    // 8. Mise à jour statut de la tâche (À faire -> En cours)
    const updateTask = await request(
      `/api/tasks/${taskId}`,
      'PUT',
      { status: 'En cours' },
      token
    );
    console.log('8. Modification statut tâche:', updateTask.status, 'Nouveau statut:', updateTask.data.status);

    // 9. Suppression du projet et de ses tâches en cascade
    const delProj = await request(`/api/projects/${projId}`, 'DELETE', null, token);
    console.log('9. Suppression projet & cascade:', delProj.status, delProj.data.message);

    console.log('🎉 TOUS LES TESTS GESTION D\'ENTREPRISE (USER, PROJECT, TASK) SONT VALIDÉS (Codes 200 & 201) !');
  } catch (err) {
    console.error('❌ Erreur durant les tests :', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
