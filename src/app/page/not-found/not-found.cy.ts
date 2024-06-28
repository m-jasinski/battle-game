describe('Page 404', () => {
  it('should show 404 information', () => {
    cy.visit('http://localhost:4200/404');
    cy.contains('Page not found');
  });

  it('should go to home page when link clicked', () => {
    cy.visit('http://localhost:4200/404');
    cy.get('a').click();
  });
});
