import React, { PureComponent } from "react";
import { Gesture } from "react-with-gesture";
import { scale } from "vec-la";
import Card from "../components/card";
import styled from "styled-components";
import { Spring } from "react-spring";
import PropTypes from "prop-types";

const initialState = {
  thrownCards: {}
};

const cardDeckPropTypes = {
  cards: PropTypes.array,
  reverse: PropTypes.bool,
  displayNoCardsLeft: PropTypes.bool,
  cardDeckId: PropTypes.number
};

const THROW_VELOCITY_THRESHOLD = 0.3;

class CardDeck extends PureComponent {
  state = {
    ...initialState,
    prevPropsCardDeckId: this.props.cardDeckId,
    cards: this.props.cards ? this.props.cards.reverse() : []
  };

  static defaultProps = {
    cardDeckId: Date.now(),
    displayNoCardsLeft: false
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.cardDeckId !== state.prevPropsCardDeckId) {
      return {
        ...initialState,
        prevPropsCardDeckId: nextProps.cardDeckId
      };
    }
    return null;
  }

  cardAnimationDone = (id, isThrown) => {
    this.setState((state) => ({
      thrownCards: {
        ...state.thrownCards,
        [id]: isThrown
      }
    }));
  };

  renderCards = (cardsInput) => {
    const { cardDeckId, reverse, displayNoCardsLeft } = this.props;
    const { thrownCards } = this.state;
    const cards = reverse ? cardsInput.reverse() : cardsInput;
    const isThrown = (id) => thrownCards && thrownCards[id];

    return (
      <Wrapper key={cardDeckId}>
        <Card
          title="No cards left"
          fixed
          content=""
          isVisible={displayNoCardsLeft}
        />
        {cards.map(
          (cardProps) =>
            !isThrown(cardProps.id) && (
              <Gesture
                key={cardProps.id}
                touch={!cardProps.fixed}
                mouse={!cardProps.fixed}
              >
                {({ first, down, delta, velocity, direction }) => {
                  const willThrow =
                    !down && velocity > THROW_VELOCITY_THRESHOLD;
                  const cardThrown = isThrown(cardProps.id);
                  const releasedNotThrown = !down && !cardThrown;
                  const springConfig = willThrow
                    ? {
                        velocity: scale(direction, velocity),
                        decay: true
                      }
                    : {
                        tension: 140,
                        friction: 30,
                        precision: 0.05
                      };
                  return (
                    <Spring
                      native
                      reset={releasedNotThrown}
                      immediate={down && !cardThrown}
                      reverse={releasedNotThrown}
                      from={{ xy: [0, 0] }}
                      to={{ xy: delta, opacity: 1.0 }}
                      config={springConfig}
                      onRest={() => {
                        if (!down && willThrow) {
                          this.cardAnimationDone(cardProps.id, willThrow);
                        }
                      }}
                    >
                      {({ xy, opacity }) => [
                        <Card
                          {...cardProps}
                          isVisible={opacity.interpolate((o) => o > 0.1)}
                          children={cardProps.content || cardProps.children}
                          style={{
                            opacity,
                            transform: xy.interpolate(
                              (x, y) =>
                                `translate(${x}px, ${y}px) scale(${
                                  down ? 1.1 : 1
                                }, ${down ? 1.1 : 1})`
                            )
                          }}
                        />
                      ]}
                    </Spring>
                  );
                }}
              </Gesture>
            )
        )}
      </Wrapper>
    );
  };

  renderProps = () => {
    const cards = [];
    return this.props.children({
      addCards: (args) => {
        if (Array.isArray(args)) {
          cards.push(...args);
        } else {
          cards.push({
            ...args,
            id: cards.length
          });
        }
      },
      renderCards: () => this.renderCards(cards.reverse())
    });
  };

  render() {
    if (this.props.cards) {
      return this.renderCards(this.props.cards);
    } else if (typeof this.props.children === "function") {
      return this.renderProps();
    } else {
      if (this.props.children) {
        const cards = Array.isArray(this.props.children)
          ? this.props.children
              .flat()
              .map((child, index) => ({ ...child.props, id: index }))
              .reverse()
          : [{ ...this.props.children.props, id: 0 }];
        return this.renderCards(cards);
      } else {
        console.error(
          "No cards available to render. Please pass them as prop, render prop or children."
        );
        return null;
      }
    }
  }
}

const Wrapper = styled.div`
  font-family: sans-serif;
`;

CardDeck.propTypes = cardDeckPropTypes;

export default CardDeck;
