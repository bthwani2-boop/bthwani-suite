import React from 'react';
import { BthBox, BthButton, BthFormScreenShell, BthKeyValueList, BthSectionHeader, BthStateView, BthSurface, BthTabs, BthText, BthTextField } from '@bthwani/ui-kit';

export type DshAwnakOrderCreateScreenState = 'ready' | 'loading' | 'disabled';

export type DshAwnakOrderCreateScreenProps = {
  state?: DshAwnakOrderCreateScreenState;
  onBack?: () => void;
  onContinue?: () => void;
};

type AwnakOrderType = 'PERSONAL_ITEMS' | 'FOOD' | 'HEAVY_WEIGHT' | 'LARGE_SIZE' | 'CAKE' | 'FRAGILE' | 'OTHER';
type AwnakTimeMode = 'now' | 'scheduled';

type PricingEstimate = {
  priceEstimate: number;
  currency: string;
};

function calculateEstimate(orderType: AwnakOrderType): PricingEstimate {
  const base = 15;
  const multiplier: Record<AwnakOrderType, number> = {
    PERSONAL_ITEMS: 1,
    FOOD: 1.1,
    HEAVY_WEIGHT: 1.6,
    LARGE_SIZE: 1.5,
    CAKE: 1.3,
    FRAGILE: 1.4,
    OTHER: 1.2,
  };

  return {
    priceEstimate: Math.round(base * multiplier[orderType]),
    currency: 'SAR',
  };
}

export function DshAwnakOrderCreateScreen({ state = 'ready', onBack, onContinue }: DshAwnakOrderCreateScreenProps) {
  const isDisabled = state === 'disabled';
  const [pickupAddress, setPickupAddress] = React.useState('Riyadh Park, Gate 2');
  const [dropoffAddress, setDropoffAddress] = React.useState('Olaya, King Fahad Road');
  const [contactName, setContactName] = React.useState('Ahmad');
  const [contactPhone, setContactPhone] = React.useState('0501234567');
  const [orderType, setOrderType] = React.useState<AwnakOrderType>('PERSONAL_ITEMS');
  const [timeMode, setTimeMode] = React.useState<AwnakTimeMode>('now');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [scheduledTime, setScheduledTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [estimate, setEstimate] = React.useState<PricingEstimate | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const submitLabel = estimate ? 'Continue to review' : 'Show estimate';

  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  const validate = () => {
    const normalizedPickup = pickupAddress.trim();
    const normalizedDropoff = dropoffAddress.trim();
    const normalizedContactName = contactName.trim();
    const normalizedContactPhone = contactPhone.trim();

    if (!normalizedPickup || !normalizedDropoff || !normalizedContactName || !normalizedContactPhone) {
      setValidationError('Pickup, dropoff, contact name, and contact phone are required.');
      return false;
    }

    if (timeMode === 'scheduled' && (!scheduledDate.trim() || !scheduledTime.trim())) {
      setValidationError('Scheduled deliveries need both a date and a time.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    if (!estimate) {
      setEstimate(calculateEstimate(orderType));
      return;
    }

    onContinue?.();
  };

  return (
    <BthFormScreenShell
      title="Awnak order create"
      subtitle="Single vertical form for manual requests. Keep the route tight, the schedule explicit, and the estimate visible before continue."
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <BthBox gap={3}>
        <BthSectionHeader title="Route" subtitle="Keep the pickup and dropoff path explicit." />
        <BthTextField label="Pickup address" value={pickupAddress} onChangeText={setPickupAddress} editable={!isDisabled} />
        <BthTextField label="Dropoff address" value={dropoffAddress} onChangeText={setDropoffAddress} editable={!isDisabled} />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="Contact" subtitle="One reachable contact is enough for this step." />
        <BthTextField label="Contact name" value={contactName} onChangeText={setContactName} editable={!isDisabled} />
        <BthTextField label="Contact phone" value={contactPhone} onChangeText={setContactPhone} editable={!isDisabled} keyboardType="phone-pad" />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="Order type" subtitle="Keep the category visible before estimate generation." />
        <BthTabs
          items={[
            { value: 'PERSONAL_ITEMS', label: 'Personal items' },
            { value: 'FOOD', label: 'Food' },
            { value: 'HEAVY_WEIGHT', label: 'Heavy weight' },
            { value: 'LARGE_SIZE', label: 'Large size' },
            { value: 'CAKE', label: 'Cake' },
            { value: 'FRAGILE', label: 'Fragile' },
            { value: 'OTHER', label: 'Other' },
          ]}
          value={orderType}
          onValueChange={(value) => setOrderType(value as AwnakOrderType)}
          variant="pill"
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="Schedule" subtitle="Choose now or reserve a slot." />
        <BthTabs
          items={[
            { value: 'now', label: 'Now' },
            { value: 'scheduled', label: 'Scheduled' },
          ]}
          value={timeMode}
          onValueChange={(value) => setTimeMode(value as AwnakTimeMode)}
          variant="pill"
        />

        {timeMode === 'scheduled' ? (
          <BthBox gap={2}>
            <BthTextField label="Date" value={scheduledDate} onChangeText={setScheduledDate} editable={!isDisabled} placeholder="YYYY-MM-DD" />
            <BthTextField label="Time" value={scheduledTime} onChangeText={setScheduledTime} editable={!isDisabled} placeholder="HH:MM" />
          </BthBox>
        ) : null}
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="Notes" subtitle="Keep the note practical and short." />
        <BthTextField label="Order note" value={notes} onChangeText={setNotes} editable={!isDisabled} hint="Examples: handle with care, call on arrival, leave at lobby."
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="Estimate" subtitle="Show the amount before continuing." />
        {estimate ? (
          <BthSurface tone="brand" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Pickup', value: pickupAddress || 'Pending' },
                { label: 'Dropoff', value: dropoffAddress || 'Pending' },
                { label: 'Order type', value: orderType.replace(/_/g, ' ').toLowerCase() },
                { label: 'Estimate', value: `${estimate.priceEstimate} ${estimate.currency}`, tone: 'brand' },
              ]}
            />
          </BthSurface>
        ) : (
          <BthSurface tone="raised" gap={2}>
            <BthText role="bodySm" tone="muted">Submit once to calculate the estimate, then continue to review.</BthText>
          </BthSurface>
        )}
      </BthBox>

      <BthBox gap={2}>
        {validationError ? <BthText role="bodySm" tone="muted">{validationError}</BthText> : null}
        <BthButton label="Back to support" tone="secondary" onPress={onBack} />
      </BthBox>
    </BthFormScreenShell>
  );
}

export default DshAwnakOrderCreateScreen;