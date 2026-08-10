"use client";

import {
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

type ProfileSettingsProps = {
  name: string | null;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  hasPassword: boolean;
};

export function ProfileSettings({
  name,
  email,
  emailVerified,
  phoneNumber,
  phoneNumberVerified,
  hasPassword,
}: ProfileSettingsProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(name ?? "");
  const [profileError, setProfileError] = useState<string>();
  const [profileMessage, setProfileMessage] = useState<string>();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [passwordMessage, setPasswordMessage] = useState<string>();
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "security">(
    "profile",
  );
  const [bindingType, setBindingType] = useState<"email" | "phone" | null>(
    null,
  );
  const [bindingValue, setBindingValue] = useState("");
  const [bindingCode, setBindingCode] = useState("");
  const [bindingStep, setBindingStep] = useState<"input" | "verify">("input");
  const [bindingError, setBindingError] = useState<string>();
  const [isBinding, setIsBinding] = useState(false);

  const emailBound = emailVerified && !email.endsWith("@placeholder.invalid");
  const phoneBound = Boolean(phoneNumber && phoneNumberVerified);
  const hasBindingRisk = !emailBound || !phoneBound;

  function openBinding(type: "email" | "phone") {
    setBindingType(type);
    setBindingValue("");
    setBindingCode("");
    setBindingError(undefined);
    setBindingStep("input");
  }

  function closeBinding(open: boolean) {
    if (!open && !isBinding) setBindingType(null);
  }

  async function sendBindingCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bindingType) return;
    setBindingError(undefined);

    const value = bindingType === "phone" ? normalizePhone(bindingValue) : bindingValue.trim().toLowerCase();
    if (bindingType === "phone" && !/^\+861[3-9]\d{9}$/.test(value)) {
      setBindingError("请输入有效的中国大陆手机号。");
      return;
    }
    if (bindingType === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      setBindingError("请输入有效的邮箱地址。");
      return;
    }

    setIsBinding(true);
    try {
      const response = await fetch(
        bindingType === "email"
          ? "/api/auth/email-otp/request-email-change"
          : "/api/auth/phone-number/send-otp",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(
            bindingType === "email" ? {newEmail: value} : {phoneNumber: value},
          ),
        },
      );
      if (!response.ok) throw new Error();
      setBindingValue(value);
      setBindingStep("verify");
    } catch {
      setBindingError("验证码发送失败，请稍后再试。");
    } finally {
      setIsBinding(false);
    }
  }

  async function verifyBindingCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bindingType) return;
    setBindingError(undefined);
    if (!/^\d{6}$/.test(bindingCode)) {
      setBindingError("请输入 6 位验证码。");
      return;
    }

    setIsBinding(true);
    try {
      const response = await fetch(
        bindingType === "email"
          ? "/api/auth/email-otp/change-email"
          : "/api/auth/phone-number/verify",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(
            bindingType === "email"
              ? {newEmail: bindingValue, otp: bindingCode}
              : {
                  phoneNumber: bindingValue,
                  code: bindingCode,
                  updatePhoneNumber: true,
                  disableSession: true,
                },
          ),
        },
      );
      if (!response.ok) throw new Error();
      setBindingType(null);
      router.refresh();
    } catch {
      setBindingError("验证码无效、已过期，或该联系方式已被绑定。");
    } finally {
      setIsBinding(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError(undefined);
    setProfileMessage(undefined);

    if (companyName.trim().length < 2) {
      setProfileError("公司名称至少需要 2 个字符。");
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({companyName}),
      });
      if (!response.ok) throw new Error();
      setProfileMessage("公司名称已保存。");
      router.refresh();
    } catch {
      setProfileError("保存失败，请稍后再试。");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(undefined);
    setPasswordMessage(undefined);

    if (newPassword.length < 8) {
      setPasswordError("新密码至少需要 8 位字符。");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("两次输入的新密码不一致。");
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({currentPassword, newPassword}),
      });
      if (!response.ok) throw new Error();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("密码已更新，其他设备已退出登录。");
    } catch {
      setPasswordError("当前密码不正确或修改失败，请重试。");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start">
      <aside className="lg:sticky lg:top-6">
        <nav
          className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1 lg:flex-col lg:overflow-visible"
          aria-label="个人中心导航"
        >
          <Button
            type="button"
            variant={activeSection === "profile" ? "default" : "ghost"}
            className="shrink-0 justify-start"
            onClick={() => setActiveSection("profile")}
          >
            <Building2 aria-hidden="true" />
            账户信息
          </Button>
          {hasPassword && (
            <Button
              type="button"
              variant={activeSection === "security" ? "default" : "ghost"}
              className="shrink-0 justify-start"
              onClick={() => setActiveSection("security")}
            >
              <KeyRound aria-hidden="true" />
              安全设置
            </Button>
          )}
        </nav>
      </aside>

      {activeSection === "profile" ? (
        <Card variant="default">
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent>
            {hasBindingRisk && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/45 bg-destructive/10 px-4 py-3.5 text-sm text-destructive">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-destructive shadow-sm">
                  <ShieldAlert className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">建议完善登录方式</p>
                  <p className="mt-0.5 text-destructive/85">
                    仅绑定一种登录方式时，遗失该联系方式可能无法找回账户。
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={saveProfile} noValidate>
              <FieldGroup>
                <Field data-invalid={Boolean(profileError)}>
                  <FieldLabel htmlFor="company-name">公司名称</FieldLabel>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="请输入公司名称"
                    aria-invalid={Boolean(profileError)}
                  />
                  <FieldError>{profileError}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="account-email">邮箱</FieldLabel>
                  {emailBound ? (
                    <div className="flex gap-2">
                      <Input
                        id="account-email"
                        value={email}
                        readOnly
                        className="bg-muted/40"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => openBinding("email")}
                      >
                        更换邮箱
                      </Button>
                    </div>
                  ) : (
                    <BindingPrompt
                      icon={<Mail aria-hidden="true" />}
                      text="暂未绑定邮箱"
                      onClick={() => openBinding("email")}
                    />
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="account-phone">手机号</FieldLabel>
                  {phoneBound ? (
                    <Input
                      id="account-phone"
                      value={phoneNumber ?? ""}
                      readOnly
                      className="bg-muted/40"
                    />
                  ) : (
                    <BindingPrompt
                      icon={<Smartphone aria-hidden="true" />}
                      text="暂未绑定手机号"
                      onClick={() => openBinding("phone")}
                    />
                  )}
                </Field>
                <Button
                  type="submit"
                  className="px-8"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile && (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  )}
                  {isSavingProfile ? "正在保存" : "保存"}
                </Button>
                {profileMessage && (
                  <p className="text-center text-sm text-muted-foreground">
                    {profileMessage}
                  </p>
                )}
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card variant="default">
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={changePassword} noValidate>
              <FieldGroup>
                <PasswordField
                  id="current-password"
                  label="旧密码"
                  placeholder="请输入旧密码"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  isVisible={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword((value) => !value)}
                />
                <PasswordField
                  id="new-password"
                  label="新密码"
                  placeholder="请输入新密码"
                  value={newPassword}
                  onChange={setNewPassword}
                  isVisible={showNewPassword}
                  onToggle={() => setShowNewPassword((value) => !value)}
                />
                <PasswordField
                  id="confirm-password"
                  label="确认新密码"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  isVisible={showNewPassword}
                  onToggle={() => setShowNewPassword((value) => !value)}
                />
                <FieldError>{passwordError}</FieldError>
                <Button
                  type="submit"
                  className="px-8"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword && (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  )}
                  {isSavingPassword ? "正在保存" : "保存"}
                </Button>
                {passwordMessage && (
                  <p className="text-center text-sm text-muted-foreground">
                    {passwordMessage}
                  </p>
                )}
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog open={bindingType !== null} onOpenChange={closeBinding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bindingType === "email"
                ? emailBound
                  ? "更换邮箱"
                  : "绑定邮箱"
                : "绑定手机号"}
            </DialogTitle>
            <DialogDescription>
              {bindingStep === "input"
                ? bindingType === "email" && emailBound
                  ? "请输入新邮箱。验证成功后，它将替换当前登录邮箱。"
                  : "输入新的联系方式，我们会发送验证码进行确认。"
                : `验证码已发送至 ${bindingValue}。`}
            </DialogDescription>
          </DialogHeader>
          {bindingStep === "input" ? (
            <form onSubmit={sendBindingCode}>
              <FieldGroup>
                <Field data-invalid={Boolean(bindingError)}>
                  <FieldLabel htmlFor="binding-value">
                    {bindingType === "email" ? "邮箱" : "手机号"}
                  </FieldLabel>
                  <Input
                    id="binding-value"
                    inputMode={bindingType === "phone" ? "tel" : "email"}
                    autoComplete={bindingType === "phone" ? "tel" : "email"}
                    placeholder={bindingType === "phone" ? "请输入中国大陆手机号" : "name@example.com"}
                    value={bindingValue}
                    onChange={(event) => setBindingValue(event.target.value)}
                    aria-invalid={Boolean(bindingError)}
                  />
                  <FieldError>{bindingError}</FieldError>
                </Field>
                <DialogFooter>
                  <Button type="submit" disabled={isBinding}>
                    {isBinding && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                    发送验证码
                  </Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={verifyBindingCode}>
              <FieldGroup>
                <Field data-invalid={Boolean(bindingError)}>
                  <FieldLabel htmlFor="binding-code">验证码</FieldLabel>
                  <Input
                    id="binding-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="请输入 6 位验证码"
                    value={bindingCode}
                    onChange={(event) => setBindingCode(event.target.value.replace(/\D/g, ""))}
                    aria-invalid={Boolean(bindingError)}
                  />
                  <FieldError>{bindingError}</FieldError>
                </Field>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setBindingStep("input")} disabled={isBinding}>
                    返回修改
                  </Button>
                  <Button type="submit" disabled={isBinding}>
                    {isBinding && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                    确认绑定
                  </Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BindingPrompt({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <div className="flex min-h-10 items-center justify-between rounded-md border border-dashed bg-muted/30 px-3 py-1.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {text}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={onClick}>
        立即绑定
      </Button>
    </div>
  );
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("86") && digits.length === 13) return `+${digits}`;
  if (digits.length === 11) return `+86${digits}`;
  return value;
}

function PasswordField({
  id,
  label,
  placeholder = "请输入密码",
  value,
  onChange,
  isVisible,
  onToggle,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={
            id === "current-password" ? "current-password" : "new-password"
          }
          className="pr-11"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
          aria-label={isVisible ? "隐藏密码" : "显示密码"}
          onClick={onToggle}
        >
          {isVisible ? (
            <EyeOff aria-hidden="true" />
          ) : (
            <Eye aria-hidden="true" />
          )}
        </Button>
      </div>
    </Field>
  );
}
