function loginViaLocalStorage() {
  cy.window().then(win => win.localStorage.setItem('token', 'fake.jwt.token'));
}

describe('Students CRUD', () => {

  beforeEach(() => {
    loginViaLocalStorage();
  });

  it('lists students', () => {
    cy.intercept('GET', '/api/students', {
      body: [
        { id: 1, firstName: 'Alice', lastName: 'Martin' },
        { id: 2, firstName: 'Bob', lastName: 'Durand' }
      ]
    }).as('list');

    cy.visit('/students');
    cy.wait('@list');
    cy.contains('Alice').should('be.visible');
    cy.contains('Bob').should('be.visible');
  });

  it('creates a new student', () => {
    cy.intercept('GET', '/api/students', { body: [] }).as('list');
    cy.intercept('POST', '/api/students', {
      statusCode: 201,
      body: { id: 99, firstName: 'Carol', lastName: 'Petit' }
    }).as('create');

    cy.visit('/students/new');
    cy.get('input[formControlName="firstName"]').type('Carol');
    cy.get('input[formControlName="lastName"]').type('Petit');
    cy.contains('button', 'Créer').click();

    cy.wait('@create');
    cy.url().should('include', '/students');
  });

  it('shows student detail', () => {
    cy.intercept('GET', '/api/students/1', {
      body: { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'a@a.fr' }
    }).as('detail');

    cy.visit('/students/1');
    cy.wait('@detail');
    cy.contains('Alice').should('be.visible');
    cy.contains('a@a.fr').should('be.visible');
  });

  it('edits a student', () => {
    cy.intercept('GET', '/api/students/1', {
      body: { id: 1, firstName: 'Alice', lastName: 'Martin' }
    }).as('detail');
    cy.intercept('PUT', '/api/students/1', {
      body: { id: 1, firstName: 'Alicia', lastName: 'Martin' }
    }).as('update');

    cy.visit('/students/1/edit');
    cy.wait('@detail');
    cy.get('input[formControlName="firstName"]').clear().type('Alicia');
    cy.contains('button', 'Mettre à jour').click();

    cy.wait('@update');
    cy.url().should('match', /\/students$/);
  });

  it('deletes a student after confirm', () => {
    cy.intercept('GET', '/api/students', {
      body: [{ id: 1, firstName: 'Alice', lastName: 'Martin' }]
    }).as('list');
    cy.intercept('DELETE', '/api/students/1', { statusCode: 204 }).as('delete');

    cy.visit('/students');
    cy.wait('@list');

    cy.on('window:confirm', () => true);

    cy.intercept('GET', '/api/students', { body: [] }).as('refreshed');
    cy.contains('button', 'Supprimer').click();

    cy.wait('@delete');
    cy.wait('@refreshed');
    cy.contains('Aucun étudiant').should('be.visible');
  });

  it('redirects to /login when no token', () => {
    cy.window().then(win => win.localStorage.removeItem('token'));
    cy.visit('/students');
    cy.url().should('include', '/login');
  });
});
