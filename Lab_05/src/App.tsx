import { useState } from 'react';
import { Button, Input, Badge, LayoutCard } from './components/ui';
import './index.css';

function App() {
  const [name, setName] = useState('');

  return (
    <main className="page">
      <p className="description">UI Kit для системы мониторинга</p>

      <LayoutCard
        title="Профиль пользователя"
        footer={
          <Button variant="primary" size="medium">
            Сохранить
          </Button>
        }
      >
        <div className="content">
          <div className="badges">
            <Badge color="green" text="online" />
            <Badge color="blue" text="admin" />
            <Badge color="orange" text="pending" />
            <Badge color="red" text="blocked" />
          </div>

          <Input
            label="Имя пользователя"
            name="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Введите имя"
            isFullWidth
            error={
              name.length < 3 && name.length > 0
                ? 'Минимум 3 символа'
                : undefined
            }
          />

          <div className="buttons">
            <Button variant="primary" size="small">
              Primary small
            </Button>

            <Button variant="secondary" size="medium">
              Secondary medium
            </Button>

            <Button variant="danger" size="large">
              Danger large
            </Button>

            <Button variant="primary" size="medium" isLoading>
              Отправить
            </Button>

            <Button variant="secondary" size="medium" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </LayoutCard>
    </main>
  );
}

export default App;