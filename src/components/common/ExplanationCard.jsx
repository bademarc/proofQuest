import { motion } from 'framer-motion';
import styled from 'styled-components';

const CardContainer = styled(motion.div)`
  background-color: var(--card-background);
  background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  border-left: 5px solid var(--primary-color);
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  }

  @media (max-width: 480px) {
    padding: var(--spacing-sm);
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  color: var(--primary-color);
  opacity: 0.2;
  font-size: 2rem;
  transform: rotate(10deg);
`;

const Title = styled(motion.h3)`
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  display: inline-flex;
  align-items: center;

  &:after {
    content: '';
    display: block;
    height: 2px;
    width: 30px;
    background: linear-gradient(to right, var(--primary-color), transparent);
    margin-left: var(--spacing-sm);
  }
`;

const Content = styled(motion.div)`
  font-size: var(--font-size-sm);
  line-height: 1.6;

  p {
    margin-bottom: var(--spacing-md);
    position: relative;
    z-index: 1;
  }

  strong {
    color: var(--secondary-color);
    font-weight: bold;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background-color: rgba(255, 140, 0, 0.2);
      z-index: -1;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(to bottom, transparent 50%, rgba(106, 90, 205, 0.2) 50%);
  padding: 0 2px;
`;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.5
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 0.5
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.5
    }
  }
};

// Get icon based on title
const getIconForTitle = (title) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('zk') || titleLower.includes('proof')) return '🔐';
  if (titleLower.includes('aggregation')) return '📦';
  if (titleLower.includes('bitvm')) return '💻';
  if (titleLower.includes('verification')) return '👁️';
  if (titleLower.includes('settlement') || titleLower.includes('bitcoin')) return '⛓️';
  if (titleLower.includes('layeredge')) return '🚀';

  return '💡';
};

// Process content to add highlights to key terms
const processContent = (children) => {
  if (typeof children !== 'string') return children;

  const keyTerms = [
    'zk-proof', 'zero-knowledge', 'aggregation', 'BitVM',
    'verification', 'settlement', 'Bitcoin', 'LayerEdge'
  ];

  let processedContent = children;

  keyTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    processedContent = processedContent.replace(regex, match => `<highlight>${match}</highlight>`);
  });

  // Split by highlight tags and wrap in components
  const parts = processedContent.split(/<highlight>|<\/highlight>/);

  return parts.map((part, index) => {
    // Even indices are regular text, odd indices are highlighted
    return index % 2 === 0 ? part : <Highlight key={index}>{part}</Highlight>;
  });
};

const ExplanationCard = ({ title, children }) => {
  const icon = getIconForTitle(title);

  return (
    <CardContainer
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -5,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.3 }
      }}
    >
      <IconContainer>{icon}</IconContainer>
      <Title variants={titleVariants}>{title}</Title>
      <Content variants={contentVariants}>
        {React.Children.map(children, child => {
          if (!child) return null;

          if (typeof child === 'string') {
            return processContent(child);
          }

          if (React.isValidElement(child) && child.type === 'p') {
            return React.cloneElement(child, {
              children: processContent(child.props.children)
            });
          }

          return child;
        })}
      </Content>
    </CardContainer>
  );
};

export default ExplanationCard;
