describe('Register screen', () => {
  it('registers a user successfully', () => {
    cy.intercept('POST', '/api/register', { statusCode: 201 }).as('register');
    cy.on('window:alert', cy.stub().as('alert'));

    cy.visit('/register');
    cy.get('input[formControlName="firstName"]').type('Alice');
    cy.get('input[formControlName="lastName"]').type('Martin');
    cy.get('input[formControlName="login"]').type('alice');
    cy.get('input[formControlName="password"]').type('secret');
    cy.contains('button', 'Register').click();

    cy.wait('@register');
    cy.get('@alert').should('have.been.calledWith', 'SUCCESS!! :-)');
  });
});
