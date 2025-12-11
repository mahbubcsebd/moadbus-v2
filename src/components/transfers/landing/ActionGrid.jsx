import ActionCard from './ActionCard';

const ActionGrid = ({ actions = [] }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          title={action.title}
          icon={action.icon}
          href={action.href}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default ActionGrid;
