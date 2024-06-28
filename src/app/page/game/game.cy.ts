describe('Game', () => {
  const STARSHIPS = 'STARSHIPS';
  const PEOPLE = 'PEOPLE';

  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should show Players cards, labels, game logo, buttons,', () => {
    cy.get('.bg-ship').should('exist');
    cy.get('mat-select').should('exist');
    cy.contains('Player 1');
    cy.contains('Player 2');
    cy.get('app-card').should('have.length.at.least', 2);
    cy.get('button').contains(`Fetch ${STARSHIPS}`);
    cy.get('button').contains('Clear Score');
  });

  it('should change game type and fetch new data', () => {
    cy.get('mat-select').click();
    cy.get('mat-option').contains('People').click();
    cy.get('app-card')
      .should('have.length.at.least', 2)
      .each(($card) => {
        expect($card).not.contain('Loading');
      });
    cy.get('mat-snack-bar-container').should('exist');
    cy.get('button').contains(`Fetch ${PEOPLE}`);
    cy.get('button').contains('Clear Score').click();
    cy.get('.mat-badge-content').then(($badges) => {
      expect($badges.first()).to.have.text('0');
      expect($badges.last()).to.have.text('0');
    });
  });

  it('should get initial data, add point and then click button to fetch new data', () => {
    cy.get('app-card')
      .should('have.length.at.least', 2)
      .each(($card) => {
        expect($card).not.contain('Loading');
      });

    let player1Crew = 0;
    let player2Crew = 0;
    cy.get('mat-snack-bar-container').should('exist');
    cy.get('mat-snack-bar-container').should('not.exist');
    cy.get('.e2e-card-value')
      .should('have.length', 2)
      .then(($card) => {
        const value1 = parseInt($card.first().text());
        const value2 = parseInt($card.last().text());

        if (value1 > value2) {
          ++player1Crew;
        } else if (value1 < value2) {
          ++player2Crew;
        }
      });
    cy.get('.mat-badge-content')
      .should('have.length', 2)
      .then(($badges) => {
        expect($badges.first()).to.have.text(player1Crew.toString());
        expect($badges.last()).to.have.text(player2Crew.toString());
      });
    cy.get('button').contains(`Fetch ${STARSHIPS}`).click();
    cy.get('mat-snack-bar-container').should('exist');
    cy.get('mat-snack-bar-container').should('not.exist');
    cy.get('.e2e-card-value').then(($card) => {
      const value1 = parseInt($card.first().text());
      const value2 = parseInt($card.last().text());

      if (value1 > value2) {
        cy.get('mat-snack-bar-container').should('not.exist');
        ++player1Crew;
      } else if (value1 < value2) {
        cy.get('mat-snack-bar-container').should('not.exist');
        ++player2Crew;
      }
    });
    cy.get('.mat-badge-content').then(($badges) => {
      expect($badges.first()).to.have.text(player1Crew.toString());
      expect($badges.last()).to.have.text(player2Crew.toString());
    });
  });
});
