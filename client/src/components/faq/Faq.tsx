import './faq.scss';
import FaqQuestions from './FaqQuestions';

const data = [
  {
    question:
      'How does the app connect me to the people I can build projects with',
    answer: ` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
  culpa nostrum quidem porro, omnis, accusamus perspiciatis dicta
  molestiae quia iste quod voluptatum esse, expedita facilis ipsa fugiat
  molestias? Recusandae, molestias?`,
  },
  {
    question: 'What skills should I have to connect with people',
    answer: ` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
      culpa nostrum quidem porro, omnis, accusamus perspiciatis dicta
      molestiae quia iste quod voluptatum esse, expedita facilis ipsa fugiat
      molestias? Recusandae, molestias?`,
  },
  {
    question: 'How does this app help me to gather a team and launch my idea',
    answer: ` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          culpa nostrum quidem porro, omnis, accusamus perspiciatis dicta
          molestiae quia iste quod voluptatum esse, expedita facilis ipsa fugiat
          molestias? Recusandae, molestias?`,
  },
  {
    question: 'Should I be professional to gather people as my team',
    answer: ` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          culpa nostrum quidem porro, omnis, accusamus perspiciatis dicta
          molestiae quia iste quod voluptatum esse, expedita facilis ipsa fugiat
          molestias? Recusandae, molestias?`,
  },
  {
    question: 'Should I be professional to gather people',
    answer: ` Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
          culpa nostrum quidem porro, omnis, accusamus perspiciatis dicta
          molestiae quia iste quod voluptatum esse, expedita facilis ipsa fugiat
          molestias? Recusandae, molestias?`,
  },
];

function Faq() {
  return (
    <div className='faq__container'>
      <h1>Questions & answers</h1>
      <div className='faq__container__section'>
        {data.map((data) => (
          <FaqQuestions
            key={data.question}
            question={data.question}
            answer={data.answer}
          />
        ))}
      </div>
    </div>
  );
}

export default Faq;
