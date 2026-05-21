// P0-06: Ops↔partner messaging workspace — preview thread UI.
// Authority: control-panel/support owns this channel. Partner sees support linked to order/catalog only.
// WLT boundary: financial-impact mentions are read-only preview tags — no mutation from this surface.
import React from 'react';
import { Box, Button, Chip, Surface, Text, TextField } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { DSH_DEMO_SUPPORT_TICKETS, type DshSupportTicketMessage } from '../../shared/operations-support.preview';

const DEMO_TICKET = DSH_DEMO_SUPPORT_TICKETS[1]; // catalog/partner-linked demo ticket

function OpsMessageBubble({ message }: { message: DshSupportTicketMessage }) {
  const isOps = message.senderKind === 'ops';
  if (message.isSystem) {
    return (
      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
        {`— ${message.body} · ${message.timestampLabel} —`}
      </Text>
    );
  }

  return (
    <Box gap={1}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: isOps ? 'flex-start' : 'flex-end' }}>
        <Text role="caption" tone="muted">{message.senderLabel}</Text>
        <Text role="caption" tone="muted">·</Text>
        <Text role="caption" tone="muted">{message.timestampLabel}</Text>
      </Box>
      <Box style={{ alignItems: isOps ? 'flex-start' : 'flex-end' }}>
        <Surface
          tone={isOps ? 'inset' : 'raised'}
          padding={2}
          gap={0}
          style={{ maxWidth: '75%' }}
        >
          <Text role="bodySm">{message.body}</Text>
        </Surface>
      </Box>
    </Box>
  );
}

export type OpsPartnerMessagingWorkspaceProps = {
  partnerId?: string;
  partnerName?: string;
  orderId?: string;
};

export function OpsPartnerMessagingWorkspace({
  partnerId = '—',
  partnerName,
  orderId,
}: OpsPartnerMessagingWorkspaceProps) {
  const [draft, setDraft] = React.useState('');
  const resolvedPartnerName = partnerName ?? DEMO_TICKET.actorName;
  const resolvedEntityId = orderId ?? DEMO_TICKET.entityId;
  const messages = DEMO_TICKET.messagesPreview;

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع الشريك</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>أوبريشن ↔ شريك</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              {resolvedPartnerName} — {partnerId}
              {resolvedEntityId ? ` — ${DEMO_TICKET.entityType} ${resolvedEntityId}` : ''}
            </p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            {/* Context strip */}
            <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip label={DEMO_TICKET.ticketCode} tone="brand" />
              <Chip label={`SLA: ${DEMO_TICKET.slaLabel}`} tone="default" />
              <Chip label={`الصف: ${DEMO_TICKET.ownerQueue}`} />
            </Box>

            {/* Message thread */}
            <Surface tone="default" padding={3} gap={3}>
              <Text role="titleSm">سجل المحادثة</Text>
              <Text role="caption" tone="muted">
                {`${messages.length} رسائل · الأدلة والمرفقات تُفتح عند الطلب فقط.`}
              </Text>
              <Box gap={3}>
                {messages.map((msg) => (
                  <OpsMessageBubble key={msg.id} message={msg} />
                ))}
              </Box>
            </Surface>

            {/* Compose area — preview-only */}
            <Surface tone="inset" padding={3} gap={3}>
              <Text role="titleSm">إرسال رسالة</Text>
              <TextField
                label="رسالة للشريك"
                value={draft}
                onChangeText={setDraft}
                placeholder="اكتب ردًا مرتبطًا بالطلب أو الكتالوج أو مشكلة الـ handoff..."
              />
              <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  label="إرسال"
                  disabled
                  onPress={undefined}
                />
                <Button
                  label="تصعيد للدعم"
                  tone="secondary"
                  disabled
                  onPress={undefined}
                />
              </Box>
              <Text role="caption" tone="muted">
                الإرسال الفعلي يتطلب ربط مسار المراسلة. هذه مساحة معاينة فقط.
              </Text>
            </Surface>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default OpsPartnerMessagingWorkspace;
