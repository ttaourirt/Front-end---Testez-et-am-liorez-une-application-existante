describe('Login screen', () => {
  it('logs in and redirects to students list', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'fake.jwt.token'
    }).as('login');
    cy.intercept('GET', '/api/students', { body: [] }).as('list');

    cy.visit('/login');
    cy.get('input[formControlName="login"]').type('alice');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Login').click();

    cy.wait('@login');
    cy.url().should('include', '/students');
    cy.window().its('localStorage.token').should('eq', 'fake.jwt.token');
  });

  it('shows error on 401', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401 }).as('login');

    cy.visit('/login');
    cy.get('input[formControlName="login"]').type('bad');
    cy.get('input[formControlName="password"]').type('bad');
    cy.contains('button', 'Login').click();

    cy.wait('@login');
    cy.contains('Identifiants invalides').should('be.visible');
  });
});
