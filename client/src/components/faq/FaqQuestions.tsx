import { useState } from 'react';

type Props = {
  question: string;
  answer: string;
};

function FaqQuestions({ question, answer }: Props) {
  const [open, setIsOpen] = useState(false);

  return (
    <div className='faq__container__items'>
      <div className='faq__container__questions'>
        <p>{question}</p>
        <p className={`faq__container-answers ${open ? 'faq__active' : ''}`}>
          {answer}
        </p>
      </div>
      <span onClick={() => setIsOpen((prev) => !prev)}>
        <img src={!open ? '/plus-icon.svg' : '/minus-icon.svg'} />
      </span>
    </div>
  );
}

export default FaqQuestions;
