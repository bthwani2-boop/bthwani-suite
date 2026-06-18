// P0-06: Ops↔captain messaging workspace — preview thread UI.
// Authority: control-panel/support owns this channel. Captain sees handoff/delivery/PoD context only.
// Forbidden: captain escalation must not bypass control-panel; no financial mutation from this surface.
import React from 'react';
import { generateLocalTempId } from '../../shared/platform/local-temp-id';
import { Box, Button, Chip, Surface, Text, TextField } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
type DshSupportTicketMessage = {
  id: string;
  senderKind: 'ops' | 'client' | 'captain' | 'partner';
  senderLabel: string;
  body: string;
  timestampLabel: string;
  isSystem?: boolean;
};

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

export type OpsCaptainMessagingWorkspaceProps = {
  captainId?: string;
  captainName?: string;
  orderId?: string;
  ticketCode?: string;
  slaLabel?: string;
};

export function OpsCaptainMessagingWorkspace({
  captainId = '—',
  captainName,
  orderId,
  ticketCode,
  slaLabel,
}: OpsCaptainMessagingWorkspaceProps) {
  const [draft, setDraft] = React.useState('');
  const [messages, setMessages] = React.useState<ReadonlyArray<DshSupportTicketMessage>>([]);
  const [isEscalated, setIsEscalated] = React.useState(false);

  const resolvedCaptainName = captainName ?? '—';
  const resolvedOrderId = orderId ?? null;

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage: DshSupportTicketMessage = {
      id: generateLocalTempId('msg-captain-custom'),
      senderKind: 'ops',
      senderLabel: 'فريق الدعم',
      body: draft.trim(),
      timestampLabel: 'الآن',
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
  };

  const handleEscalate = () => {
    if (isEscalated) return;
    const newSystemMsg: DshSupportTicketMessage = {
      id: generateLocalTempId('msg-captain-system'),
      senderKind: 'ops',
      senderLabel: 'النظام',
      body: 'تم تصعيد المحادثة إلى إدارة الدعم والالتزام لشؤون الكباتن والتوصيل.',
      timestampLabel: 'الآن',
      isSystem: true,
    };
    setMessages((prev) => [...prev, newSystemMsg]);
    setIsEscalated(true);
    if (typeof window !== 'undefined') {
      window.alert('سياق الحوكمة: تم تصعيد محادثة الكابتن. القرار المالي النهائي خاضع لحوكمة WLT.');
    }
  };

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع الكابتن</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeTextInverse}>أوبريشن ↔ كابتن</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              {resolvedCaptainName} — {captainId}
              {resolvedOrderId ? ` — طلب ${resolvedOrderId}` : ''}
            </p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            {/* Context strip */}
            <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip label={ticketCode ? `تذكرة ${ticketCode}` : 'لا توجد تذكرة مرتبطة'} tone="brand" />
              {slaLabel ? <Chip label={`SLA: ${slaLabel}`} tone="default" /> : null}
              <Chip label="تسليم / توصيل / إثبات" />
              {isEscalated ? <Chip label="مصعد" tone="danger" /> : null}
            </Box>

            {/* Boundary note */}
            <Surface tone="inset" padding={2} gap={1}>
              <Text role="caption" tone="muted">
                الكابتن يرى حالات التسليم والتوصيل والإثبات فقط. أي تصعيد يمر عبر لوحة التحكم — لا مسار مباشر خارج هذا الصف.
              </Text>
            </Surface>

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

            {/* Compose area */}
            <Surface tone="inset" padding={3} gap={3}>
              <Text role="titleSm">إرسال رسالة</Text>
              <TextField
                label="رسالة للكابتن"
                value={draft}
                onChangeText={setDraft}
                placeholder="اكتب تحديثًا موجزًا مرتبطًا بالتسليم أو التوصيل أو الإثبات..."
              />
              <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  label="إرسال"
                  onPress={handleSend}
                />
                <Button
                  label={isEscalated ? 'تم التصعيد' : 'تصعيد للدعم'}
                  tone="secondary"
                  disabled={isEscalated}
                  onPress={handleEscalate}
                />
              </Box>
              <Text role="caption" tone="muted">
                الإرسال غير متاح حتى يكتمل ربط مسار المراسلة الحقيقي.
              </Text>
            </Surface>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default OpsCaptainMessagingWorkspace;
