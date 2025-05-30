// disabling `cypress/unsafe-to-chain-command` is mainly due to chaining from `cy.focused()`
//  which seems perfectly fine to do according to the docs:
//  https://docs.cypress.io/api/commands/focused
/* eslint-disable cypress/unsafe-to-chain-command */

describe('focus-trap', () => {
  beforeEach(() => cy.visit('index.html?bundle=cypress'));

  /**
   * Verify focus trap is **trapping** focus by clicking outside element
   * @param focusedElSelectorOrAliasInTrap Element in trap that should have focus when outside element is clicked
   */
  function verifyCrucialFocusTrapOnClicking(focusedElSelectorOrAliasInTrap) {
    // trap is active(keep focus in trap by blocking clicks on outside focusable element)
    cy.findAllByRole('link', { name: 'Return to the repository' })
      .first()
      .click();
    cy.get(focusedElSelectorOrAliasInTrap).should('be.focused');

    // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
    cy.findByRole('heading', { name: 'focus-trap demo' }).click();
    cy.get(focusedElSelectorOrAliasInTrap).should('be.focused');
  }

  /**
   * Verify focus trap is **NOT** trapping focus by tab
   * @param cyWrapper Cypress object of outside focused element yielded from `cy.get/contains/findByRole...etc`
   */
  function verifyFocusIsNotTrapped(cyWrapper) {
    cyWrapper.should('be.focused');

    // focus can be transitioned freely when trap is unmounted
    let previousFocusedEl;
    cy.focused()
      .then(([lastlyFocusedEl]) => {
        return (previousFocusedEl = lastlyFocusedEl);
      })
      .tab();

    cy.focused().should(([nextFocusedEl]) =>
      expect(nextFocusedEl).not.equal(previousFocusedEl)
    );
  }

  describe('demo: default', () => {
    it('traps focus tab sequence and allows deactivation by clicking deactivate button', () => {
      cy.get('#demo-default').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#default-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .should('be.focused')
        .tab();

      // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });

    it('allows deactivation by pressing ESC', () => {
      cy.get('#demo-default').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@firstElementInTrap').type('{esc}');
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  describe('demo: animated-dialog', () => {
    it('traps focus tab sequence and allows deactivation by clicking deactivate button', () => {
      cy.get('#demo-animated-dialog').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // activated message should be visible (per onPostActivate option)
      cy.get('#animated-dialog-trap-activated').should('be.visible');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#animated-dialog-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .should('be.focused')
        .tab();

      // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });

    it('allows deactivation by pressing ESC', () => {
      cy.get('#demo-animated-dialog').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@firstElementInTrap').type('{esc}');
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  describe('demo: animated-trigger', () => {
    [true, false].forEach((returnFocus) => {
      it(`traps focus tab sequence and allows deactivation by clicking deactivate button, ${
        returnFocus
          ? 'focus returns to trigger on deactivate'
          : 'focus does NOT return to trigger on deactivate'
      }`, () => {
        cy.get('#demo-animated-trigger').as('testRoot');

        if (!returnFocus) {
          // disable the returnFocus option (which is on by default)
          cy.get('#animated-trigger-returnfocus').click();
        }

        // activate trap
        cy.get('@testRoot')
          .findByRole('button', { name: /^activate trap/ })
          .as('lastlyFocusedElementBeforeTrapIsActivated')
          .click();

        // 1st element should be focused
        cy.get('@testRoot')
          .findByRole('link', { name: 'with' })
          .as('firstElementInTrap')
          .should('be.focused');

        // trap is active(keep focus in trap by blocking clicks on outside focusable element)
        cy.get('#return-to-repo').click();
        cy.get('@firstElementInTrap').should('be.focused');

        // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
        cy.get('#animated-trigger-heading').click();
        cy.get('@firstElementInTrap').should('be.focused');

        // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
        cy.get('@firstElementInTrap')
          .tab()
          .should('have.text', 'some')
          .should('be.focused')
          .tab()
          .should('have.text', 'focusable')
          .should('be.focused')
          .tab()
          .as('lastElementInTrap')
          .should('contain', 'deactivate trap')
          .should('be.focused')
          .tab();

        // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
        cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
        cy.get('@lastElementInTrap').should('be.focused');

        cy.get('@testRoot')
          .findByRole('button', { name: /^deactivate trap/ })
          .as('deactivateButton')
          .click();

        if (returnFocus) {
          // Activate button (trigger) should have focus again
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
            'be.focused'
          );
        } else {
          // Activate button (trigger) should NOT have focus again
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
            'be.not.focused'
          );
        }

        // deactivated message should be visible (per onPostDeactivate option)
        cy.get('#animated-trigger-trap-deactivated').should('be.visible');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(
          // if focus was returned, Activate has focus; otherwise, Deactivate does
          returnFocus
            ? cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
            : cy.get('@deactivateButton')
        );
      });
    });

    it('allows deactivation by pressing ESC', () => {
      cy.get('#demo-animated-trigger').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@firstElementInTrap').type('{esc}');
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  // describe('demo: activation-element-shadow-dom', () => {
  //   NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    support Shadow DOM, and Cypress itself doesn't have great support for it either
  // });

  describe('demo: escape deactivates', () => {
    it('traps focus tab sequence and disallows deactivation by ESC after trap is activated', () => {
      cy.get('#demo-escape-deactivates').as('testRoot');

      cy.get('#escape-deactivates-option')
        .as('testOption')
        .should('be.checked');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#escape-deactivates-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .should('be.focused')
        .tab();

      // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');

      // prevent deactivation by unchecking option
      cy.get('@firstElementInTrap').focus();
      cy.get('@testOption').click();
      cy.get('@firstElementInTrap').type('{esc}');
      cy.get('@firstElementInTrap').should('be.focused');

      // re-allow deactivation by ESC and deactivate
      cy.get('@testOption').click();
      cy.get('@firstElementInTrap').type('{esc}');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      // NOTE: While the trap should have returned focus to the 'activate trap' button
      //  (`@lastlyFocusedElementBeforeTrapIsActivated`), having Cypress click on the
      //  `@testOptional` element (which is outside the trap) seems to confuse things,
      //  but only in Cypress, in that focus doesn't return to the 'activate trap'
      //  button even though debugging shows that the trap clearly does focus that
      //  button upon deactivation. In Cypress, however, when allowing outside clicks,
      //  it seems Cypress does something peculiar that overrides the trap's ability
      //  to return focus to the activate button.
      verifyFocusIsNotTrapped(cy.get('@lastElementInTrap'));
    });
  });

  describe('demo: escape key cancelation', () => {
    it('allows the Escape key to be canceled from a child within the focus trap', () => {
      cy.get('#demo-escape-key-cancelation').as('testRoot');

      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      cy.get('@testRoot')
        .findByRole('textbox', { name: /^Escape-canceling input/ })
        .as('escapeCancelingInput')
        .click()
        .type('{esc}')
        .should('be.focused');

      cy.get('@testRoot')
        .findByRole('textbox', { name: /^Non-escape-canceling input/ })
        .as('nonEscapeCancelingInput')
        .click()
        .type('{esc}')
        .should('not.be.focused');

      cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');
    });
  });

  describe('demo: iene', () => {
    beforeEach(() => {
      cy.get('#demo-iene').as('testRoot');

      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('activateTrapBtn')
        .as('lastlyFocusedElBeforeTrapIsActivated');

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivateTrapBtn');

      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap');
    });

    it('on trap activation, focuses on manually specified input element, when initialFocus="#focused-input"', () => {
      cy.get('@activateTrapBtn').click();

      // instead of next tab-order element being focused, element specified should be focused
      cy.get('@testRoot')
        .findByRole('textbox', { name: 'Initially focused input' })
        .as('focusedEl')
        .should('be.focused');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@focusedEl');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@deactivateTrapBtn').click();

      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });

    ['false', 'function-false'].forEach((option) => {
      it(`on trap activation, does not focus ANY element in the trap, when initialFocus=${
        option === 'false' ? option : '`() => false`'
      }`, () => {
        cy.get('#select-iene').select(option);

        cy.get('@activateTrapBtn').click();

        cy.get('@firstElementInTrap').should('not.be.focused');

        // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
        cy.focused()
          .tab()
          .should('have.text', 'with')
          .should('be.focused')
          .tab()
          .should('have.text', 'some')
          .should('be.focused')
          .tab()
          .should('have.text', 'focusable')
          .should('be.focused')
          .tab()
          .should('have.id', 'focused-input')
          .should('be.focused')
          .tab()
          .as('lastElementInTrap')
          .should('contain', 'deactivate trap')
          .should('be.focused')
          .tab();

        // trap is active (keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
        cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
        cy.get('@lastElementInTrap').should('be.focused');

        // deactivate trap
        cy.get('#deactivate-iene').click();

        // implies trap no longer active since checkbox is outside trap
        cy.get('#activate-iene').should('be.focused');

        cy.get('@lastElementInTrap').should('not.be.focused');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(cy.get('#activate-iene'));
      });
    });

    it('brings focus to a manually focused element if focus is lost outside the trap, when initialFocus=false', () => {
      cy.get('#select-iene').select('false');

      cy.get('@activateTrapBtn').click();

      cy.get('@firstElementInTrap').should('not.be.focused');

      cy.get('@testRoot')
        .findByRole('link', { name: 'some' })
        .as('secondElementInTrap')
        .should('not.be.focused');

      cy.get('@secondElementInTrap').focus();

      cy.get('@secondElementInTrap').should('be.focused');

      // focus element outside trap
      cy.get('#activate-iene').focus();

      // ensure focus was brought back to manually focused element
      cy.get('@secondElementInTrap').should('be.focused');
    });

    it('Escape key does not deactivate trap. Instead, click on "deactivate trap" to deactivate trap', () => {
      cy.get('@activateTrapBtn').click();

      // trying deactivate trap by ESC
      cy.get('@testRoot')
        .findByRole('textbox', { name: 'Initially focused input' })
        .as('trapChild')
        .focus();
      cy.get('@trapChild').type('{esc}');

      // ESC does not deactivate the trap
      cy.get('@trapChild').should('exist').should('be.focused');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@trapChild');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@deactivateTrapBtn').click();

      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  // initially-focused-container
  describe('demo: ifc', () => {
    beforeEach(() => {
      cy.get('#demo-ifc').as('testRoot');
    });

    it('specify element to be focused (even with attribute tabindex="-1") after focus trap activation', () => {
      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // instead of next tab-order element being focused, initial focus element should be focused
      cy.get('@testRoot').get('#ifc').should('be.focused');

      // active trap does not return focus back to 'tabindex="-1"' containing element, and keep focus inside of that containing element
      // NOTE: since the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
      //  understand that a non-tabbable node can still be focusable and that it's possible
      //  to tab away from it, we have to trigger the tab key on the 'first' button even
      //  though we know focus is on the #ifc container; still, the sequence should be the
      //  same as if we were able to do `cy.focused().tab()`, which means 4 tabs to get back
      //  to the 'first' button in the full sequence
      cy.get('@testRoot')
        .findByRole('button', { name: 'first' })
        .as('firstTabbableElInTrap')
        .tab() // to first
        .tab() // to second
        .tab() // to deactivate
        .tab(); // should go back to first
      cy.get('@firstTabbableElInTrap').should('be.focused');

      // click on outside element deactivates this trap
      cy.findByRole('heading', { name: 'focus-trap demo' }).click();
      cy.get('@firstTabbableElInTrap').should('be.not.focused');

      // focus can be transitioned freely when trap is deactivated
      // NOTE: a heading is NOT focusable, and this demo uses the default option of
      //  `returnFocusOnDeactivate=true`, so that means focus will return to the node
      //  that had focus just before activation
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });

    it('specify element to be focused (even with attribute tabindex="-1") after focus trap activation, and use reverse tab order', () => {
      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // instead of next tab-order element being focused, initial focus element should be focused
      cy.get('@testRoot').get('#ifc').should('be.focused');

      // active trap does not return focus back to 'tabindex="-1"' containing element, and keep focus inside of that containing element
      // NOTE: since the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
      //  understand that a non-tabbable node can still be focusable and that it's possible
      //  to tab away from it, we have to trigger the tab key on the 'first' button even
      //  though we know focus is on the #ifc container; still, the sequence should be the
      //  same as if we were able to do `cy.focused().tab()`, which means 4 tabs to get back
      //  to the 'first' button in the full sequence
      cy.get('@testRoot')
        .findByRole('button', { name: 'first' })
        .as('firstTabbableElInTrap')
        .tab({ shift: true }); // to deactivate

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .should('be.focused');

      cy.focused()
        .tab({ shift: true }) // to second
        .tab({ shift: true }); // to first
      cy.get('@firstTabbableElInTrap').should('be.focused');

      // click on outside element deactivates this trap
      cy.findByRole('heading', { name: 'focus-trap demo' }).click();
      cy.get('@firstTabbableElInTrap').should('be.not.focused');

      // focus can be transitioned freely when trap is deactivated
      // NOTE: a heading is NOT focusable, and this demo uses the default option of
      //  `returnFocusOnDeactivate=true`, so that means focus will return to the node
      //  that had focus just before activation
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  describe('demo: ht', () => {
    // hidden treasures
    beforeEach(() => {
      cy.get('#demo-ht').as('testRoot');
    });

    it('focusing on only visually available (display is not "none" and visibility is not "hidden") elements', () => {
      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();

      // only visually available elements can be tabbed thru
      cy.focused().as('firstTabbableElInTrap').tab().tab();
      cy.get('@firstTabbableElInTrap').should('be.focused');

      // Show some more elements within trap and they should be tabbable
      cy.get('@testRoot')
        .findByRole('button', { name: 'click to show more' })
        .click();
      cy.tab();
      cy.findByRole('button', { name: 'nothing again' }).should('be.focused');
      cy.tab();
      cy.findByRole('button', { name: 'click to show less' })
        .should('be.focused')
        .as('focusedElInTrap');

      verifyCrucialFocusTrapOnClicking('@focusedElInTrap');

      cy.get('@focusedElInTrap').focus();
      cy.focused().type('{enter}'); // buttons 3 and 4 will disappear, leaving body focused

      // NOTE: while `cy.tab()` at this point works in Chrome and causes focus-trap to
      //  set focus to the 'nothing' button as it brings focus back into the trap, and
      //  this also works when manually testing with FF, it doesn't work when using FF
      //  under Cypress because whatever element ends-up getting focus after the two
      //  hidden buttons disappear is, for some reason, deemed non-tabbable and therefore
      //  the cypress-plugin-tab plugin throws an error, so we have to set focus to the
      //  'nothing' button in order to continue testing in FF at this point
      cy.get('@testRoot')
        .findByRole('button', { name: /^nothing$/ })
        .focus();

      // focus can be transitioned freely when trap is deactivated
      cy.focused().type('{esc}');
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: nested', () => {
    it('focus is trapped in the innermost trap of nested traps', () => {
      cy.get('#demo-nested').as('testRoot');

      // activate outer trap and element in outer trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();

      cy.findByRole('button', { name: /^deactivate outer trap/ })
        .as('firstTabbableElInOuterTrap')
        .should('be.focused');

      verifyCrucialFocusTrapOnClicking('@firstTabbableElInOuterTrap');

      // primary trap should not have been paused/unpaused yet
      cy.get('#nested').as('primaryTrap');
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-pause-called-times',
        '0'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-pause-called-times',
        '0'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-unpause-called-times',
        '0'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-unpause-called-times',
        '0'
      );

      // activate inner trap and element in inner trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate inner trap/ })
        .as('lastlyFocusedElInOuterTrap')
        .click();

      cy.get('@testRoot')
        .findByRole('button', { name: 'nothing' })
        .should('be.focused')
        .as('focusedElInInnerTrap');

      verifyCrucialFocusTrapOnClicking('@focusedElInInnerTrap');

      // primary trap was paused
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-pause-called-times',
        '1'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-pause-called-times',
        '1'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-unpause-called-times',
        '0'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-unpause-called-times',
        '0'
      );

      // only element in the innermost active trap can be focused
      cy.get('@firstTabbableElInOuterTrap').click();
      cy.get('@firstTabbableElInOuterTrap').should('not.be.focused');

      // deactivate inner trap and outer trap element can be focused again
      cy.findByRole('button', {
        name: /^deactivate and close inner trap/,
      }).click();
      cy.get('@lastlyFocusedElInOuterTrap').should('be.focused');

      // primary trap was unpaused
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-pause-called-times',
        '1'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-pause-called-times',
        '1'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-unpause-called-times',
        '1'
      );
      cy.get('@primaryTrap').should(
        'have.attr',
        'data-ft-test-primary-on-post-unpause-called-times',
        '1'
      );

      // focus can be transitioned freely when trap is deactivated
      cy.get('@firstTabbableElInOuterTrap').click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: sibling', () => {
    it('focus returns to lastly activated sibling trap when current trap is deactivated', () => {
      cy.get('#demo-sibling').as('testRoot');

      // activate 1st sibling trap and element in 1st sibling trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate first trap/ })
        .as('elInFirstTrap')
        .click();
      verifyCrucialFocusTrapOnClicking('@elInFirstTrap');

      // activate 2nd sibling trap and element in 2nd sibling trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate second trap/ })
        .as('firstElInFirstTrap')
        .click();
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate second trap/ })
        .as('deactivateElInSecondTrap');
      verifyCrucialFocusTrapOnClicking('@deactivateElInSecondTrap');

      // deactivate 2nd sibling trap and element should return to lastly focused element in 1st sibling trap
      cy.get('@deactivateElInSecondTrap').click();
      cy.get('@firstElInFirstTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate first trap/ })
        .click();
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });
  });

  describe('demo: tif', () => {
    it('when trap is activated, if there is not any tabbable element in the trap, focus-trap will try to focus the element specified by option "fallbackFocus"', () => {
      cy.get('#demo-tif').as('testRoot');

      // activate trap(no tabbable element inside) and the container element(which is the fallback element specified) should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('activate')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot').get('#tif').should('be.focused');
      verifyCrucialFocusTrapOnClicking('#tif');

      // deactivate trap and element outside of trap can be focused again
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivate')
        .click();
      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('be.focused');

      // activate trap(tabbable element inside) and the first tabbable element should be focused;
      cy.get('@testRoot')
        .findByRole('button', { name: 'show focusable button' })
        .click();
      cy.get('@activate').click();
      cy.get('@testRoot')
        .findByRole('button', { name: 'hide focusable button' })
        .as('firstTabbableElInOuterTrap')
        .should('be.focused');
      verifyCrucialFocusTrapOnClicking('@firstTabbableElInOuterTrap');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@deactivate').click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: iswf', () => {
    it('when trap is activated and initialFocus is selector to existing node, that node is focused', () => {
      cy.get('#demo-iswf').as('testRoot');

      cy.get('#checkbox-iswf').as('testOption').should('be.checked');

      // activate trap, which should focus the "initial focus" button because it exists
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('activate')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot')
        .get('#initial-focus-btn-iswf')
        .as('initialFocusButton')
        .should('be.focused');
      verifyCrucialFocusTrapOnClicking('@initialFocusButton');

      // deactivate trap and element outside of trap can be focused again
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivate')
        .click();
      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('be.focused');
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });

    it('when trap is activated and initialFocus is selector to non-existent node, fallbackFocus option is used', () => {
      cy.get('#demo-iswf').as('testRoot');

      cy.get('#checkbox-iswf').as('testOption').should('be.checked');
      cy.get('@testOption').click(); // initial state is checked, so uncheck it
      cy.get('@testOption').should('not.be.checked');

      // activate trap, which should focus the container because the "initial focus" button doesn't exist
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('activate')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot').get('#iswf').should('be.focused');
      verifyCrucialFocusTrapOnClicking('#iswf');

      // deactivate trap and element outside of trap can be focused again
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivate')
        .click();
      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('be.focused');
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: input', () => {
    it('if current focused element is already in the trap, focus activation does not change its selection range"', () => {
      cy.get('#demo-input-activation').as('testRoot');

      // trap is activated after input change and input selection range is not changed
      cy.get('@testRoot')
        .get('#focused-input8')
        .as('inputElInTrap')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .type('1');
      verifyCrucialFocusTrapOnClicking('@inputElInTrap');

      cy.get('@inputElInTrap').then(([input]) => {
        expect(input.selectionStart).to.equal('1'.length);
        expect(input.selectionEnd).to.equal('1'.length);
      });

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: delay', () => {
    it('activates the focus trap when delayInitialFocus is set to true', () => {
      cy.get('#delay').should(($div) => {
        expect($div[0].style.opacity).to.equal('0.2');
      });
      cy.get('#activate-delay')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .type('{enter}');
      cy.get('#delay').should('have.class', 'trap is-active');
      cy.get('#delay').should(($div) => {
        expect($div[0].style.opacity).to.equal('1');
      });
      cy.get('#close-button-delay').as('hideButtonInTrap').should('have.focus');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@hideButtonInTrap');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@hideButtonInTrap').click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });

    it('activates the focus trap when delayInitialFocus is set to false', () => {
      cy.get('#no-delay').should(($div) => {
        expect($div[0].style.opacity).to.equal('0.2');
      });
      cy.get('#activate-no-delay')
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .type('{enter}');
      cy.get('#no-delay').should('have.class', 'trap is-active');
      cy.get('#no-delay').should(($div) => {
        expect($div[0].style.opacity).to.equal('1');
      });
      cy.get('#close-button-no-delay')
        .as('hideButtonInTrap')
        .should('have.focus');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@hideButtonInTrap');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@hideButtonInTrap').click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: radio', () => {
    it('radio group in active trap can have its value changed', () => {
      cy.get('#demo-radio').as('testRoot');

      // activate trap and 1st element in focus should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot').findByRole('radio', { name: 'b' }).as('radioB');
      verifyCrucialFocusTrapOnClicking('@radioB');

      //// radio group value can be changed

      // Cypress limitation to radio group value change: keyboard arrow keys can't change value
      // so forcibly change the value by `check` command
      //    cy.findByRole('group', { name: 'Radio group in trap' }).type('{downArrow}');
      //    cy.get('@radioB').type('{downArrow}');
      cy.get('@testRoot')
        .findByRole('radio', { name: 'c' })
        .as('radioC')
        .check();
      cy.get('@radioC').should('be.checked');

      // 'Tab' in trap should only focus the checked radio item without changing radio group value
      cy.get('@radioC').focus();
      cy.tab();
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivateElInTrap')
        .should('be.focused');
      cy.tab();
      cy.get('@radioC').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@deactivateElInTrap').click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('demo: iframe', () => {
    it('focus can be moved freely in the iframe inside of trap', () => {
      cy.get('#demo-iframe').as('testRoot');

      // activate trap and element trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot')
        .findByRole('button', { name: 'nothing' })
        .as('firstElInTrap')
        .should('be.focused');
      verifyCrucialFocusTrapOnClicking('@firstElInTrap');

      /*
       focus can move into/out of iframe in trap
       Due to cypress limitation(see below), `tab` is not tested
      */

      // Cypress limitation: `cy.tab()` skips focus on <iframe>
      // cy.tab();
      cy.get('@testRoot').find('iframe').as('iframeInTrap');
      cy.get('@iframeInTrap').then(([iframe]) => {
        // Cypress limitation: TypeError: Cannot read property 'call' of undefined
        // cy.wrap(iframe.contentDocument).find('a').should('exist');
        const buttonEl = iframe.contentDocument.querySelector('button');
        cy.wrap(buttonEl).as('buttonInIFrame').click();
        cy.get('@buttonInIFrame').should('be.focused');

        verifyCrucialFocusTrapOnClicking('@buttonInIFrame');
      });

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivateElInTrap')
        .click();
      verifyFocusIsNotTrapped(cy.get('@lastlyFocusedElBeforeTrapIsActivated'));
    });
  });

  describe('Click outside go through', () => {
    const activateTrap = function (buttonName = 'activate trap') {
      cy.get('@testRoot')
        .findByRole('button', {
          name: new RegExp(`^${buttonName.replace(/\//g, '\\/')}`),
        })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();
    };

    const checkTrap = function (lastElementInTrapText) {
      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', lastElementInTrapText)
        .should('be.focused')
        .tab();

      // trap is active (keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');
    };

    describe('demo: allowoutsideclick', () => {
      it('click on outside element should work while keeping focus trapped inside of trap(createOptions.allowOutsideClick: boolean(true)', () => {
        cy.get('#demo-allowoutsideclick').as('testRoot');

        // activate trap and element trap should be focused
        activateTrap('activate/deactivate trap');
        checkTrap('deactivate trap');

        // click on outside element goes through. In this case, the click deactivates the trap
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').click();
        verifyFocusIsNotTrapped(
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
        );
      });

      it('click on outside element should work while keeping focus trapped inside of trap(createOptions.allowOutsideClick = () => true)', () => {
        cy.get('#demo-allowoutsideclick').as('testRoot');

        // set allowClickOutside as a function
        cy.get('@testRoot')
          .findByRole('combobox', { name: 'Set allowOutsideClick as:' })
          .select('function');

        // activate trap and element trap should be focused
        activateTrap('activate/deactivate trap');
        checkTrap('deactivate trap');

        // click on outside element goes through. In this case, the click deactivates the trap
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').click();
        verifyFocusIsNotTrapped(
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
        );
      });
    });

    describe('demo: clickoutsidedeactivates', () => {
      it('traps focus, deactivates on outside click on checkbox and checkbox focused, clickOutsideDeactivates=Boolean, returnFocusOnDeactivate=true', () => {
        cy.get('#demo-clickoutsidedeactivates').as('testRoot');

        // set returnFocusOnDeactivate=TRUE
        cy.get(
          '#select-returnfocusondeactivate-clickoutsidedeactivates'
        ).select('true');

        activateTrap();
        checkTrap('nothing');

        // deactivate trap by toggling FOCUSABLE checkbox
        cy.get('#checkbox-clickoutsidedeactivates').click();
        cy.get('#checkbox-clickoutsidedeactivates').should('be.checked');

        // implies trap no longer active since checkbox is outside trap, but note that since
        //  returnFocusOnDeactivate=TRUE, focus will be on the element focused just before
        //  activation, not the checkbox, even though the checkbox is focusable
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
          'be.focused'
        );

        cy.get('@lastElementInTrap').should('not.be.focused');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
        );
      });

      it('traps focus, deactivates on outside click on checkbox and checkbox focused, clickOutsideDeactivates=Function, returnFocusOnDeactivate=true', () => {
        cy.get('#demo-clickoutsidedeactivates').as('testRoot');

        // set clickOutsideDeactivates as a function
        cy.get('@testRoot')
          .findByRole('combobox', { name: 'Set clickOutsideDeactivates as:' })
          .select('function');

        // set returnFocusOnDeactivate=TRUE
        cy.get(
          '#select-returnfocusondeactivate-clickoutsidedeactivates'
        ).select('true');

        activateTrap();
        checkTrap('nothing');

        // deactivate trap by toggling FOCUSABLE checkbox
        cy.get('#checkbox-clickoutsidedeactivates').click();
        cy.get('#checkbox-clickoutsidedeactivates').should('be.checked');

        // implies trap no longer active since checkbox is outside trap, but note that since
        //  returnFocusOnDeactivate=TRUE, focus will be on the element focused just before
        //  activation, not the checkbox, even though the checkbox is focusable
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
          'be.focused'
        );

        cy.get('@lastElementInTrap').should('not.be.focused');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
        );
      });

      it('traps focus, deactivates on outside click on document and "activate trap" button focused', () => {
        cy.get('#demo-clickoutsidedeactivates').as('testRoot');

        // set returnFocusOnDeactivate=TRUE
        cy.get(
          '#select-returnfocusondeactivate-clickoutsidedeactivates'
        ).select('true');

        activateTrap();
        checkTrap('nothing');

        // deactivate trap by clicking NON-focusable element
        cy.get('#clickoutsidedeactivates-heading').click();
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
          'be.focused'
        );

        cy.get('@lastElementInTrap').should('not.be.focused');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
        );
      });

      it('traps focus, deactivates on outside click on checkbox and checkbox focused, returnFocusOnDeactivate=false', () => {
        cy.get('#demo-clickoutsidedeactivates').as('testRoot');

        // set returnFocusOnDeactivate=FALSE
        cy.get(
          '#select-returnfocusondeactivate-clickoutsidedeactivates'
        ).select('false');

        activateTrap();
        checkTrap('nothing');

        // deactivate trap by toggling FOCUSABLE checkbox
        cy.get('#checkbox-clickoutsidedeactivates').click();
        cy.get('#checkbox-clickoutsidedeactivates').should('be.checked');

        // implies trap no longer active since checkbox is outside trap, and since
        //  returnFocusOnDeactivate=FALSE, focus remains on the focusable checkbox
        cy.get('#checkbox-clickoutsidedeactivates').should('be.focused');

        cy.get('@lastElementInTrap').should('not.be.focused');

        // focus can be transitioned freely when trap is deactivated
        verifyFocusIsNotTrapped(cy.get('#checkbox-clickoutsidedeactivates'));
      });

      it('traps focus, deactivates on outside click on document, and nothing is focused', () => {
        cy.get('#demo-clickoutsidedeactivates').as('testRoot');

        // set returnFocusOnDeactivate=FALSE
        cy.get(
          '#select-returnfocusondeactivate-clickoutsidedeactivates'
        ).select('false');

        activateTrap();
        checkTrap('nothing');

        // deactivate trap by clicking NON-focusable element
        cy.get('#clickoutsidedeactivates-heading').click();

        cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
          'not.be.focused'
        );
        cy.get('@lastElementInTrap').should('not.be.focused');
        cy.get('*:focus').should('not.exist'); // nothing has focus

        // focus can be transitioned freely when trap is deactivated
        cy.tab().as('outsideFocusedEl');
        verifyFocusIsNotTrapped(cy.get('@outsideFocusedEl'));
      });
    });
  });

  describe('demo: setreturnfocus', () => {
    it('specify element to receive focus after trap deactivation', () => {
      cy.get('#demo-setreturnfocus').as('testRoot');

      // activate trap and element trap should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElInTrap')
        .should('be.focused');
      verifyCrucialFocusTrapOnClicking('@firstElInTrap');

      // after trap deactivation, focus returns on element specified by `setReturnFocus` instead of lastly focused element before trap
      // activation
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('not.be.focused');
      cy.get('@testRoot')
        .findByRole('button', { name: 'Element to return' })
        .as('outsideFocusedEl')
        .should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      verifyFocusIsNotTrapped(cy.get('@outsideFocusedEl'));
    });
  });

  describe('demo: setreturnfocus function', () => {
    it('specify dynamically element to receive focus after trap deactivation', () => {
      cy.get('#demo-setreturnfocus-function').as('testRoot');

      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElBeforeTrapIsActivated')
        .click();
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElInTrap')
        .should('be.focused');
      verifyCrucialFocusTrapOnClicking('@firstElInTrap');

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate and focus this/ })
        .as('deactivateAndFocusThis')
        .click();
      cy.get('@deactivateAndFocusThis').should('be.focused');

      cy.get('@lastlyFocusedElBeforeTrapIsActivated').click();

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate and focus 'activate trap'/ })
        .as('deactivateAndFocusActivateTrap')
        .click();
      cy.get('@deactivateAndFocusActivateTrap').should('not.be.focused');

      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('be.focused');

      cy.get('@lastlyFocusedElBeforeTrapIsActivated').click();
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate and no change in focus/ })
        .as('deactivateAndNoChangeInFocus')
        .click();
      cy.get('@deactivateAndNoChangeInFocus').should('not.be.focused');

      cy.get('@lastlyFocusedElBeforeTrapIsActivated').should('not.be.focused');
    });
  });

  describe('demo: multiple elements passed in', () => {
    it('can accept multiple elements passed in, and keep the focus within the elements', () => {
      cy.get('#demo-multipleelements').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .should('have.text', 'See')
        .should('be.focused')
        .tab()
        .should('have.text', 'how')
        .should('be.focused')
        .tab()
        .should('have.text', 'works')
        .should('be.focused')
        .tab()
        .should('have.text', 'with')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'works')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'how')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'See')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'some')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'with')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'works')
        .should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });

    it('can adjust to some containers no longer containing any tabbable nodes', () => {
      cy.get('#demo-multipleelements-delete').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: 'Gets removed' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'Remove button')
        .should('be.focused')
        .tab()
        .should('have.text', 'Some')
        .should('be.focused')
        .tab()
        .should('have.text', 'other')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .should('have.text', 'Gets removed')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'other')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Some')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Remove button')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Gets removed')
        .should('be.focused');

      // now remove the button in the first container while it has focus (though
      //  the click here will cause it to lose focus, which is normal)
      cy.get('@testRoot')
        .findByRole('button', { name: 'Remove button' })
        .as('removeButton')
        .click();

      cy.get('@firstElementInTrap').should('not.exist'); // removed from the DOM

      cy.get('@removeButton')
        .should('be.focused')
        .tab()
        .should('have.text', 'Some')
        .should('be.focused')
        .tab()
        .should('have.text', 'other')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .should('have.text', 'Remove button')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'other')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Some')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Remove button')
        .should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@removeButton').type('{esc}'); // NOTE: for some reason, clicking the button doesn't work in Cypress only; works with manual testing
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });

    it('can adjust to all containers no longer containing any tabbable nodes provided there is a fallback focus node', () => {
      cy.get('#demo-multipleelements-delete-all').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('deactivateTrap');

      cy.get('@testRoot')
        .findByRole('button', { name: 'Remove all button' })
        .as('removeButton');

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: 'Gets removed' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'Remove all button')
        .should('be.focused')
        .tab()
        .should('have.text', 'Gets removed')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Remove all button')
        .should('be.focused')
        .tab({ shift: true })
        .should('have.text', 'Gets removed')
        .should('be.focused');

      // now remove the button in the first container while it has focus (though
      //  the click here will cause it to lose focus, which is normal), and also
      //  remove the button used to remove the other button
      cy.get('@removeButton').click();

      cy.get('@firstElementInTrap').should('not.exist'); // removed from the DOM
      cy.get('@removeButton').should('not.exist'); // removed from the DOM

      // in 'real life', nothing seems to have focus at this point, and pressing the
      //  tab key causes the browser to set focus to the 'deactivate' button, but
      //  `cy.tab()`, `cy.get('body').tab()` and a few other things don't work
      //  for some reason; in any case, the fact we can programmatically set focus
      //  to the deactivate button still comes down to the fact that it's the
      //  fallback focus node
      cy.get('@deactivateTrap').focus();

      // focus can be transitioned freely when trap is deactivated
      cy.get('@deactivateTrap').click();
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });
  });

  describe('demo: multiple traps with multiple elements', () => {
    it('multiple traps with multiple elements works', () => {
      cy.get('#demo-multipleelements-multipletraps').as('testRoot');

      // activate trap 1
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap 1/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // Focus should be in trap 1
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' }) // trap 1 first group
        .should('be.focused')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .should('have.text', 'See') // over to trap 1 second group
        .should('be.focused');

      // activate focus trap 2.  This should pause trap 1
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap 2/ })
        .click();

      // Focus should be in trap 2
      cy.get('@testRoot')
        .findByRole('link', { name: 'something' }) // trap 2 first group
        .should('be.focused')
        .tab()
        .should('have.text', 'last') // over to trap 2 second group
        .should('be.focused')
        .tab()
        .should('have.text', 'area')
        .should('be.focused')
        .tab()
        .should('have.text', 'something') // back to trap 2 first group
        .should('be.focused');

      // stop focus trap 2
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap 2/ })
        .click({ force: true }); // click fails without `force` option

      // focus should resume back to trap 1 second group with 'See' link focused
      //  since it was the active element at the time trap 2 was activated
      cy.get('@testRoot')
        .findByRole('link', { name: 'See' }) // trap 1 second group
        .should('be.focused')
        .tab()
        .should('have.text', 'how')
        .should('be.focused')
        .tab()
        .should('have.text', 'works')
        .should('be.focused')
        .tab()
        .should('have.text', 'with') // over to trap 1 first group
        .should('be.focused');

      // focus can be transitioned freely when both traps are deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap 1/ })
        .as('lastButtonClicked')
        .click({ force: true }); // click fails without `force` option

      // focus can be transitioned freely when trap is deactivated
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });
  });

  describe('demo: multiple traps with manual pause', () => {
    it('manually paused trap will not be automatically unpaused if another trap is deactivated', () => {
      cy.get('#demo-multipletraps-manual-pause').as('testRoot');

      // activate trap 1
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap 1/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // activate focus trap 2. This should pause trap 1
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap 2/ })
        .click();

      // pause focus trap 1 manually
      cy.get('@testRoot')
        .findByRole('button', { name: /^pause trap 1/ })
        .click();

      // stop focus trap 2
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap 2/ })
        .click({ force: true }); // click fails without `force` option

      // focus can be transitioned freely when trap 2 is deactivated because trap 1 is still paused
      cy.findByRole('heading', { name: 'focus-trap demo' })
        .as('outsideEl')
        .click();
      verifyFocusIsNotTrapped(cy.get('@outsideEl'));
    });
  });

  describe('demo: global trap stack', () => {
    it('traps focus tab sequence and allows deactivation by clicking deactivate button', () => {
      cy.get('#demo-global-trap-stack').as('testRoot');

      cy.get('@testRoot').find('.counter').should('have.text', '0');

      cy.window().its('__trapStack.length').should('equal', 0);

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      cy.get('@testRoot').find('.counter').should('have.text', '1');

      cy.window().its('__trapStack.length').should('equal', 1);

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#global-trap-stack-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .should('be.focused')
        .tab();

      // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );

      cy.get('@testRoot').find('.counter').should('have.text', '0');

      cy.window().its('__trapStack.length').should('equal', 0);
    });
  });

  describe('demo: arrow-keys', () => {
    it('traps focus tab sequence using j/k keys and allows deactivation by clicking deactivate button', () => {
      cy.get('#demo-arrow-keys').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#arrow-keys-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by cycling through the focus trap's tabbable elements
      //  using custom 'k' key to move forward)
      cy.get('@firstElementInTrap').trigger('keydown', { key: 'k' });
      cy.focused().should('have.text', 'some').trigger('keydown', { key: 'k' });
      cy.focused()
        .should('have.text', 'focusable')
        .trigger('keydown', { key: 'k' });
      cy.focused()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .trigger('keydown', { key: 'k' });

      // trap is active(keep focus in trap by cycling backward through the focus trap's tabbable
      //  elements using custom 'j' key to move backward)
      cy.get('@firstElementInTrap')
        .should('be.focused')
        .trigger('keydown', { key: 'j' });
      cy.get('@lastElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  describe('demo: removing elements', () => {
    it('traps focus even when focused element is removed', () => {
      cy.get('#demo-dom-remove').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#arrow-keys-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // when the focused element is removed, focus is transitioned to the first
      // focusable element in the trap
      cy.get('@testRoot').findByRole('button', { name: 'remove' }).click();
      cy.focused().should('not.be.undefined').and('have.text', 'with');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });
  });

  // describe('demo: inert', () => {
  //   NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    support the `inert` attribute so there's no point in writing a test for this demo at
  //    this time.
  // });

  // describe('demo: with-shadow-dom', () => {
  //   NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    support Shadow DOM, and Cypress itself doesn't have great support for it either
  //    (see comments for the 'in-open-shadow-dom' test above) so there's no point in writing
  //    a test for this demo at this time.
  // });

  // describe('demo: in-open-shadow-dom', () => {
  //   NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    support Shadow DOM, and Cypress itself doesn't have great support for it either
  //    so there's no point in writing a test for this demo at this time.
  //
  //   Because of how Cypress interacts with Shadown DOMs, we can't use labels
  //    on elements _inside_ the shadow host. When we click outside the trap and then
  //    test if the labelled element is focused, Cypress says yes, but really, it
  //    sees the shadow as a black box that has focus, so it's not the real test
  //    we're wanting to check. Also, the cypress-plugin-tab will complain if we try
  //    to .tab() from inside the shadow host saying it's not a tabbable element
  //    because it doesn't appear to support shadow DOM.
  //
  //   We can't use cypress-plugin-tab to tab between elements in the trap
  //    to check the tab sequence is constrained to the trap because the plugin
  //    doesn't support Shadow DOM. It will keep crashing the test, claiming that
  //    the focused element is not tabbable (because it doesn't see past the
  //    shadow host).
  // });

  // describe('demo: negative-tabindex', () => {
  //   NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    understand that a non-tabbable node can still be focusable and that it's possible
  //    to tab away from it. As such, we can't test this demo because it requires setting
  //    focus to an element with negative tabindex and tabbing away from it in one direction
  //    or another.
  // });

  describe('demo: positive-tabindex', () => {
    it('supports nodes with positive tabindexes', () => {
      cy.get('#demo-positive-tabindex').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('button', { name: 'tabindex 1' })
        .as('firstElementInTrap')
        .should('be.focused');

      // trap is active (keep focus in trap by blocking clicks on outside focusable element)
      cy.get('#return-to-repo').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active (keep focus in trap by blocking clicks on outside un-focusable element)
      cy.get('#default-heading').click();
      cy.get('@firstElementInTrap').should('be.focused');

      // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.get('@firstElementInTrap')
        .tab()
        .should('have.text', 'tabindex 2')
        .should('be.focused')
        .tab()
        .should('have.text', 'tabindex 3')
        .should('be.focused')
        .tab()
        .wait(500) // need slight delay here to allow trap to pull focus back in
        .focused() // `wait()` yields the node it was given, but it should have changed by now
        .should('have.text', 'with')
        .should('be.focused')
        .tab()
        .should('have.text', 'some')
        .should('be.focused')
        .tab()
        .should('have.text', 'focusable')
        .should('be.focused')
        .tab()
        .should('have.text', 'tabindex 0')
        .should('be.focused')
        .tab()
        .should('have.text', 'tabindex ?')
        .should('be.focused')
        .tab()
        .as('lastElementInTrap')
        .should('contain', 'deactivate trap')
        .should('be.focused')
        .tab(); // back to @firstElementInTrap

      // trap is active (keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
      cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
      cy.get('@lastElementInTrap').should('be.focused');

      // focus can be transitioned freely when trap is deactivated
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      verifyFocusIsNotTrapped(
        cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      );
    });

    // NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
    //  understand that a non-tabbable node can still be focusable and that it's possible
    //  to tab away from it. As such, we can't test that tabbing from the negative tabindex
    //  button leads to the "tabindex 3" button in DOM order.
  });

  // NOTE: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //  support web components, so we can't successfully run this test because it will skip
  //  over the web component when tabbing from 'button 3', jumping to 'button 4' instead of
  //  the expectation of going to the 'open-web-component' button. Remember that
  //  cypress-plugin-tab using some other internal tabbable-like library to determine what
  //  the tabbable nodes are and moves focus that way.
  // describe('demo: with-open-web-component', () => {
  //   it.only('traps focus tab sequence and allows deactivation by clicking deactivate button', () => {
  //     cy.get('#demo-with-open-web-component').as('testRoot');
  //
  //     // activate trap
  //     cy.get('@testRoot')
  //       .findByRole('button', { name: /^activate trap/ })
  //       .as('lastlyFocusedElementBeforeTrapIsActivated')
  //       .click();
  //
  //     // 1st element should be focused
  //     cy.get('@testRoot')
  //       .findByRole('button', { name: 'button 1' })
  //       .as('firstElementInTrap')
  //       .should('be.focused');
  //
  //     // trap is active (keep focus in trap by blocking clicks on outside focusable element)
  //     cy.get('#return-to-repo').click();
  //     cy.get('@firstElementInTrap').should('be.focused');
  //
  //     // trap is active (keep focus in trap by blocking clicks on outside un-focusable element)
  //     cy.get('#with-open-web-component-heading').click();
  //     cy.get('@firstElementInTrap').should('be.focused');
  //
  //     // trap is active (keep focus in trap by tabbing through the focus trap's tabbable elements)
  //     cy.get('@firstElementInTrap')
  //       .tab()
  //       .should('have.text', 'button 2')
  //       .should('be.focused')
  //       .tab()
  //       .should('have.text', 'button 3')
  //       .should('be.focused')
  //       .tab()
  //       .should('have.text', 'open-web-component')
  //       .should('be.focused')
  //       .tab()
  //       .should('have.text', 'button 4')
  //       .should('be.focused')
  //       .tab()
  //       .should('have.text', 'button 5')
  //       .should('be.focused')
  //       .tab()
  //       .as('lastElementInTrap')
  //       .should('contain', 'deactivate trap')
  //       .should('be.focused')
  //       .tab();
  //
  //     // trap is active (keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
  //     cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
  //     cy.get('@lastElementInTrap')
  //       .should('be.focused')
  //       .tab({ shift: true })
  //       .should('have.text', 'button 5')
  //       .should('be.focused')
  //       .tab({ shift: true })
  //       .should('have.text', 'button 4')
  //       .should('be.focused')
  //       .tab({ shift: true })
  //       .should('have.text', 'open-web-component')
  //       .should('be.focused')
  //       .tab({ shift: true })
  //       .should('have.text', 'button 3')
  //       .should('be.focused')
  //       .tab({ shift: true })
  //       .should('have.text', 'button 2')
  //       .should('be.focused')
  //       .tab({ shift: true });
  //
  //     cy.get('@firstElementInTrap').should('be.focused');
  //
  //     // focus can be transitioned freely when trap is deactivated
  //     cy.get('@testRoot')
  //       .findByRole('button', { name: /^deactivate trap/ })
  //       .click();
  //     verifyFocusIsNotTrapped(
  //       cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
  //     );
  //   });
  // });
});
