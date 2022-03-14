import React from "react";
import tw from "twin.macro";
const ChartCards = ({ cards }) => {
  return (
    <StyledContainer>
      {cards.map((card) => {
        const { title, value, label } = card;
        return (
          <StyledCard>
            <SmallTitle>{title}</SmallTitle>
            <ValueTitle>{value}</ValueTitle>
            <LableText>{label}</LableText>
          </StyledCard>
        );
      })}
    </StyledContainer>
  );
};

export default ChartCards;

const StyledContainer = tw.div`
    grid grid-cols-1 sm:grid-cols-2 mb-4 md:grid-cols-4 gap-x-5 gap-y-5 
    `;
const SmallTitle = tw.p`
   mb-1 uppercase text-base font-normal
    `;
const StyledCard = tw.div` 
  p-4 bg-CardBg dark:bg-off-white dark:bg-opacity-10 hover:bg-light-primary text-light-primary dark:text-grey-dark hover:text-grey-dark bg-opacity-30 transition-all duration-300 `;
const ValueTitle = tw.h3`
   text-32 font-extrabold `;
const LableText = tw.div`
  text-22
`;
