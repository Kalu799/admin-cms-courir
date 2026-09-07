<script setup>
</script>

<template>
  <section class="dashboard-screen">
    <div class="dashboard-container">
      <h1>Dashboard admin</h1>

      <div class="dashboard-grid">
        <RouterLink to="/programmes" class="dashboard-card">
          <h2>Programmes</h2>
          <p>
            Gérer les saisons, semaines, sessions et exercices.
          </p>
        </RouterLink>

        <RouterLink to="/users" class="dashboard-card">
          <h2>Coureurs</h2>
          <p>
            Voir les inscrits et leur progression.
          </p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.dashboard-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
}

.dashboard-container h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.dashboard-card {
  display: block;

  padding: 24px;

  border-radius: 18px;

  background-color: #ffffff;
  color: #022c4d;

  text-decoration: none;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 6%),
    0 12px 32px rgb(2 44 77 / 8%);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.dashboard-card h2 {
  margin: 0 0 8px;

  color: #85bc24;

  font-size: 1.4rem;
  font-weight: 800;
}

.dashboard-card p {
  margin: 0;

  color: #52616c;

  line-height: 1.5;
}

.dashboard-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 4px 10px rgb(2 44 77 / 8%),
    0 16px 36px rgb(2 44 77 / 10%);
}

@media (min-width: 700px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>