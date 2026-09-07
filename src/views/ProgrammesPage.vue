<script setup>
import { ref, onMounted } from 'vue'

const saisons = ref([])
const loading = ref(true)
const errorMessage = ref('')

const getSaisons = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/saisons`
    )

    if (!response.ok) {
      throw new Error('Impossible de récupérer les programmes')
    }

    saisons.value = await response.json()
  }
  catch (error) {
    errorMessage.value = error.message
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getSaisons()
})
</script>

<template>
  <section class="programmes-screen">
    <div class="programmes-container">
      <h1>Programmes</h1>

      <p v-if="loading">
        Chargement...
      </p>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <div v-for="saison in saisons" :key="saison.id" class="saison-card">
        <details>
          <summary class="saison-summary">
            <span>{{ saison.label }}</span>

            <span class="summary-info">
              {{ saison.semaines.length }} semaines
            </span>
          </summary>

          <div class="saison-content">
            <details v-for="semaine in saison.semaines" :key="semaine.id" class="semaine-card">
              <summary class="semaine-summary">
                Semaine {{ semaine.numero }}
              </summary>

              <div class="semaine-content">
                <details v-for="session in semaine.jours" :key="session.id" class="session-card">
                  <summary class="session-summary">
                    <span>{{ session.label }}</span>

                    <span class="summary-info">
                      {{ session.exercices.length }} exercices
                    </span>
                  </summary>

                  <ul class="exercices-list">
                    <li v-for="exercice in session.exercices" :key="exercice.id" class="exercice-item">
                      <span>
                        {{ exercice.type }}
                      </span>

                      <strong>
                        {{ exercice.dureeMinutes }} min
                      </strong>
                    </li>
                  </ul>
                </details>
              </div>
            </details>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.programmes-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.programmes-container {
  width: 100%;
  max-width: 1000px;

  margin: 0 auto;
}

.programmes-container>h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}

/* =========================
   DETAILS / SUMMARY GLOBAL
========================= */

details {
  width: 100%;
}

summary {
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.saison-summary,
.semaine-summary,
.session-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  box-sizing: border-box;
}

.saison-summary::before,
.semaine-summary::before,
.session-summary::before {
  content: '›';

  display: inline-block;

  flex-shrink: 0;

  font-size: 1.3rem;
  font-weight: 800;

  transition: transform 0.2s ease;
}

details[open]>.saison-summary::before,
details[open]>.semaine-summary::before,
details[open]>.session-summary::before {
  transform: rotate(90deg);
}

.summary-info {
  margin-left: auto;

  color: #70808b;

  font-size: 0.85rem;
  font-weight: 500;
}

/* =========================
   SAISONS
========================= */

.saison-card {
  margin-bottom: 16px;

  border-radius: 16px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);

  overflow: hidden;
}

.saison-summary {
  padding: 20px 22px;

  color: #022c4d;

  font-size: 1.2rem;
  font-weight: 800;
}

.saison-summary:hover {
  background-color: #fafbf8;
}

.saison-content {
  padding: 0 18px 18px;
}

/* =========================
   SEMAINES
========================= */

.semaine-card {
  margin-top: 10px;

  border-radius: 12px;

  background-color: #f7f8f5;

  overflow: hidden;
}

.semaine-summary {
  padding: 15px 16px;

  color: #022c4d;

  font-size: 1rem;
  font-weight: 700;
}

.semaine-summary:hover {
  background-color: #eef2ea;
}

.semaine-content {
  padding: 0 12px 12px;
}

/* =========================
   SESSIONS / JOURS
========================= */

.session-card {
  margin-top: 8px;

  border-radius: 10px;

  background-color: #ffffff;

  overflow: hidden;
}

.session-summary {
  padding: 13px 14px;

  color: #022c4d;

  font-size: 0.95rem;
  font-weight: 700;
}

.session-summary:hover {
  background-color: #fafbf8;
}

/* =========================
   EXERCICES
========================= */

.exercices-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  margin: 0;
  padding: 0 14px 14px;

  list-style: none;
}

.exercice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 9px 12px;

  border-radius: 8px;

  background-color: #f2f6ed;

  color: #022c4d;

  font-size: 0.9rem;
}

.exercice-item span {
  min-width: 0;
}

.exercice-item strong {
  flex-shrink: 0;

  font-size: 0.85rem;
  font-weight: 700;
}

/* =========================
   MESSAGES
========================= */

.programmes-container>p {
  margin: 16px 0;

  color: #52616c;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 600px) {
  .programmes-screen {
    padding: 24px 12px 40px;
  }

  .programmes-container>h1 {
    margin-bottom: 22px;

    font-size: 1.7rem;
  }

  .saison-summary {
    padding: 17px 16px;

    font-size: 1.05rem;
  }

  .saison-content {
    padding: 0 10px 12px;
  }

  .semaine-summary {
    padding: 13px 12px;
  }

  .semaine-content {
    padding: 0 8px 10px;
  }

  .session-summary {
    padding: 12px;
  }

  .exercices-list {
    padding: 0 10px 10px;
  }

  .exercice-item {
    padding: 8px 10px;

    font-size: 0.85rem;
  }

  .summary-info {
    font-size: 0.78rem;
  }
}
</style>