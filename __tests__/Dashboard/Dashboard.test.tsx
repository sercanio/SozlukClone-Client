import React from 'react';
import { render, screen } from '@/test-utils';
import { Dashboard } from '@/shared/components/admin/dashboard/Dashboard';

describe('Dashboard', () => {
  it('renders Dashboard component', () => {
    render(<Dashboard />);
    expect(screen.getByText('Yönetim Paneli')).toBeInTheDocument();
  });
});
