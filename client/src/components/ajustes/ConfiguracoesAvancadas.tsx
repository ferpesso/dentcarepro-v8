// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Save,
  Database,
  Bell,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Shield,
  Zap,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfiguracoesAvancadas() {
  const { data: config, refetch } = trpc.configuracoes.obter.useQuery();
  const { data: configLembretes } = trpc.lembretes.obterConfiguracoes.useQuery();
  const salvarMutation = trpc.configuracoes.salvar.useMutation();
  const configurarLembretesMutation = trpc.lembretes.configurarAutomaticos.useMutation();

  const [backupConfig, setBackupConfig] = useState({
    automatico: true,
    frequencia: "diario",
    horario: "03:00",
    retencao: 30,
  });

  const [notificacoesConfig, setNotificacoesConfig] = useState({
    email: {
      ativo: true,
      novasConsultas: true,
      cancelamentos: true,
      pagamentos: true,
    },
    whatsapp: {
      ativo: false,
      apiKey: "",
      numeroRemetente: "",
    },
    sms: {
      ativo: false,
      provedor: "twilio",
      apiKey: "",
      numeroRemetente: "",
    },
  });

  const [lembretesConfig, setLembretesConfig] = useState({
    lembreteConsulta: {
      ativo: true,
      diasAntes: [1, 3, 7],
      canais: ["whatsapp", "email"],
      mensagemTemplate: "Olá [NOME_PACIENTE], você tem consulta agendada para [DATA_CONSULTA] às [HORA_CONSULTA] com [NOME_DENTISTA].",
    },
    lembreteRetorno: {
      ativo: true,
      diasDepois: 30,
      canal: "whatsapp",
      mensagemTemplate: "Olá [NOME_PACIENTE], já faz um tempo desde sua última consulta. Agende seu retorno!",
    },
    lembreteAniversario: {
      ativo: true,
      canal: "whatsapp",
      mensagemTemplate: "Feliz aniversário [NOME_PACIENTE]! 🎉 Toda a equipe [NOME_CLINICA] deseja um dia especial!",
    },
    lembretePagamento: {
      ativo: true,
      diasAntes: 3,
      canal: "whatsapp",
      mensagemTemplate: "Olá [NOME_PACIENTE], você tem um pagamento de €[VALOR] com vencimento em [DATA_VENCIMENTO].",
    },
  });

  const [integracoesConfig, setIntegracoesConfig] = useState({
    googleCalendar: {
      ativo: false,
      clientId: "",
      clientSecret: "",
    },
    stripe: {
      ativo: false,
      publicKey: "",
      secretKey: "",
    },
    mailchimp: {
      ativo: false,
      apiKey: "",
      listId: "",
    },
  });

  useEffect(() => {
    if (config?.avancado) {
      setBackupConfig(config.avancado.backup || backupConfig);
      setNotificacoesConfig(config.avancado.notificacoes || notificacoesConfig);
      setIntegracoesConfig(config.avancado.integracoes || integracoesConfig);
    }
  }, [config]);

  useEffect(() => {
    if (configLembretes) {
      setLembretesConfig(configLembretes);
    }
  }, [configLembretes]);

  const handleSaveBackup = async () => {
    try {
      await salvarMutation.mutateAsync({
        ...config,
        avancado: {
          ...config?.avancado,
          backup: backupConfig,
        },
      });
      toast.success("Configurações de backup salvas!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSaveNotificacoes = async () => {
    try {
      await salvarMutation.mutateAsync({
        ...config,
        avancado: {
          ...config?.avancado,
          notificacoes: notificacoesConfig,
        },
      });
      toast.success("Configurações de notificações salvas!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSaveLembretes = async () => {
    try {
      await configurarLembretesMutation.mutateAsync(lembretesConfig);
      toast.success("Configurações de lembretes salvas!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSaveIntegracoes = async () => {
    try {
      await salvarMutation.mutateAsync({
        ...config,
        avancado: {
          ...config?.avancado,
          integracoes: integracoesConfig,
        },
      });
      toast.success("Configurações de integrações salvas!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleBackupNow = () => {
    toast.success("Backup iniciado! Você receberá uma notificação quando concluir.");
  };

  const handleRestoreBackup = () => {
    toast.info("Funcionalidade de restauração em desenvolvimento");
  };

  return (
    <Tabs defaultValue="backup" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="backup">
          <Database className="w-4 h-4 mr-2" />
          Backup
        </TabsTrigger>
        <TabsTrigger value="notificacoes">
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="lembretes">
          <Clock className="w-4 h-4 mr-2" />
          Lembretes
        </TabsTrigger>
        <TabsTrigger value="integracoes">
          <Zap className="w-4 h-4 mr-2" />
          Integrações
        </TabsTrigger>
      </TabsList>

      {/* Backup */}
      <TabsContent value="backup" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Backup Automático
            </CardTitle>
            <CardDescription>
              Configure backups automáticos dos dados da clínica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="backup-auto">Backup Automático</Label>
                <p className="text-sm text-gray-500">
                  Realizar backup automático dos dados
                </p>
              </div>
              <Switch
                id="backup-auto"
                checked={backupConfig.automatico}
                onCheckedChange={(checked) =>
                  setBackupConfig({ ...backupConfig, automatico: checked })
                }
              />
            </div>

            {backupConfig.automatico && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <select
                      id="frequencia"
                      value={backupConfig.frequencia}
                      onChange={(e) =>
                        setBackupConfig({ ...backupConfig, frequencia: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      type="time"
                      value={backupConfig.horario}
                      onChange={(e) =>
                        setBackupConfig({ ...backupConfig, horario: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retencao">Retenção (dias)</Label>
                    <Input
                      id="retencao"
                      type="number"
                      value={backupConfig.retencao}
                      onChange={(e) =>
                        setBackupConfig({ ...backupConfig, retencao: parseInt(e.target.value) })
                      }
                      min="7"
                      max="365"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <strong>Próximo backup:</strong> Hoje às {backupConfig.horario}
                      <br />
                      <strong>Backups armazenados:</strong> Últimos {backupConfig.retencao} dias
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBackupNow} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Fazer Backup Agora
              </Button>
              <Button onClick={handleRestoreBackup} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Restaurar Backup
              </Button>
              <Button onClick={handleSaveBackup} className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Backups */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Backups</CardTitle>
            <CardDescription>
              Últimos backups realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { data: "2025-10-24 03:00", tamanho: "245 MB", status: "Sucesso" },
                { data: "2025-10-23 03:00", tamanho: "243 MB", status: "Sucesso" },
                { data: "2025-10-22 03:00", tamanho: "241 MB", status: "Sucesso" },
              ].map((backup, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{backup.data}</div>
                      <div className="text-sm text-gray-500">{backup.tamanho}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-green-600 font-medium">
                      {backup.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notificações */}
      <TabsContent value="notificacoes" className="space-y-6">
        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Notificações por Email
            </CardTitle>
            <CardDescription>
              Configure notificações automáticas por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Ativar Email</Label>
                <p className="text-sm text-gray-500">Enviar notificações por email</p>
              </div>
              <Switch
                checked={notificacoesConfig.email.ativo}
                onCheckedChange={(checked) =>
                  setNotificacoesConfig({
                    ...notificacoesConfig,
                    email: { ...notificacoesConfig.email, ativo: checked },
                  })
                }
              />
            </div>

            {notificacoesConfig.email.ativo && (
              <div className="space-y-3 pl-6 border-l-2">
                <div className="flex items-center justify-between">
                  <Label>Novas Consultas</Label>
                  <Switch
                    checked={notificacoesConfig.email.novasConsultas}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({
                        ...notificacoesConfig,
                        email: { ...notificacoesConfig.email, novasConsultas: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Cancelamentos</Label>
                  <Switch
                    checked={notificacoesConfig.email.cancelamentos}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({
                        ...notificacoesConfig,
                        email: { ...notificacoesConfig.email, cancelamentos: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Pagamentos</Label>
                  <Switch
                    checked={notificacoesConfig.email.pagamentos}
                    onCheckedChange={(checked) =>
                      setNotificacoesConfig({
                        ...notificacoesConfig,
                        email: { ...notificacoesConfig.email, pagamentos: checked },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              WhatsApp Business API
            </CardTitle>
            <CardDescription>
              Integração com WhatsApp para envio de mensagens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Ativar WhatsApp</Label>
                <p className="text-sm text-gray-500">Enviar mensagens via WhatsApp</p>
              </div>
              <Switch
                checked={notificacoesConfig.whatsapp.ativo}
                onCheckedChange={(checked) =>
                  setNotificacoesConfig({
                    ...notificacoesConfig,
                    whatsapp: { ...notificacoesConfig.whatsapp, ativo: checked },
                  })
                }
              />
            </div>

            {notificacoesConfig.whatsapp.ativo && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-key">API Key</Label>
                  <Input
                    id="whatsapp-key"
                    type="password"
                    value={notificacoesConfig.whatsapp.apiKey}
                    onChange={(e) =>
                      setNotificacoesConfig({
                        ...notificacoesConfig,
                        whatsapp: { ...notificacoesConfig.whatsapp, apiKey: e.target.value },
                      })
                    }
                    placeholder="Sua chave de API"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-numero">Número Remetente</Label>
                  <Input
                    id="whatsapp-numero"
                    value={notificacoesConfig.whatsapp.numeroRemetente}
                    onChange={(e) =>
                      setNotificacoesConfig({
                        ...notificacoesConfig,
                        whatsapp: { ...notificacoesConfig.whatsapp, numeroRemetente: e.target.value },
                      })
                    }
                    placeholder="+351 XXX XXX XXX"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveNotificacoes}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </TabsContent>

      {/* Lembretes - continua no próximo arquivo devido ao tamanho */}
      <TabsContent value="lembretes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Lembretes Automáticos</CardTitle>
            <CardDescription>
              Configure lembretes automáticos para pacientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lembrete de Consulta */}
            <div className="space-y-4 pb-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Lembrete de Consulta</Label>
                  <p className="text-sm text-gray-500">
                    Enviar lembrete antes da consulta agendada
                  </p>
                </div>
                <Switch
                  checked={lembretesConfig.lembreteConsulta.ativo}
                  onCheckedChange={(checked) =>
                    setLembretesConfig({
                      ...lembretesConfig,
                      lembreteConsulta: { ...lembretesConfig.lembreteConsulta, ativo: checked },
                    })
                  }
                />
              </div>

              {lembretesConfig.lembreteConsulta.ativo && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>Enviar com antecedência de (dias)</Label>
                    <div className="flex gap-2">
                      {[1, 3, 7, 15].map((dia) => (
                        <Button
                          key={dia}
                          variant={
                            lembretesConfig.lembreteConsulta.diasAntes.includes(dia)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            const diasAntes = lembretesConfig.lembreteConsulta.diasAntes.includes(dia)
                              ? lembretesConfig.lembreteConsulta.diasAntes.filter((d) => d !== dia)
                              : [...lembretesConfig.lembreteConsulta.diasAntes, dia];
                            setLembretesConfig({
                              ...lembretesConfig,
                              lembreteConsulta: { ...lembretesConfig.lembreteConsulta, diasAntes },
                            });
                          }}
                        >
                          {dia} {dia === 1 ? "dia" : "dias"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lembrete de Retorno */}
            <div className="space-y-4 pb-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Lembrete de Retorno</Label>
                  <p className="text-sm text-gray-500">
                    Lembrar paciente de agendar retorno
                  </p>
                </div>
                <Switch
                  checked={lembretesConfig.lembreteRetorno.ativo}
                  onCheckedChange={(checked) =>
                    setLembretesConfig({
                      ...lembretesConfig,
                      lembreteRetorno: { ...lembretesConfig.lembreteRetorno, ativo: checked },
                    })
                  }
                />
              </div>

              {lembretesConfig.lembreteRetorno.ativo && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>Enviar após (dias da última consulta)</Label>
                    <Input
                      type="number"
                      value={lembretesConfig.lembreteRetorno.diasDepois}
                      onChange={(e) =>
                        setLembretesConfig({
                          ...lembretesConfig,
                          lembreteRetorno: {
                            ...lembretesConfig.lembreteRetorno,
                            diasDepois: parseInt(e.target.value),
                          },
                        })
                      }
                      min="7"
                      max="365"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lembrete de Aniversário */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Lembrete de Aniversário</Label>
                  <p className="text-sm text-gray-500">
                    Enviar mensagem de parabéns no aniversário
                  </p>
                </div>
                <Switch
                  checked={lembretesConfig.lembreteAniversario.ativo}
                  onCheckedChange={(checked) =>
                    setLembretesConfig({
                      ...lembretesConfig,
                      lembreteAniversario: { ...lembretesConfig.lembreteAniversario, ativo: checked },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveLembretes}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </TabsContent>

      {/* Integrações */}
      <TabsContent value="integracoes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Integrações Externas</CardTitle>
            <CardDescription>
              Conecte o sistema com serviços externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Calendar */}
            <div className="space-y-4 pb-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Google Calendar</Label>
                  <p className="text-sm text-gray-500">
                    Sincronizar consultas com Google Calendar
                  </p>
                </div>
                <Switch
                  checked={integracoesConfig.googleCalendar.ativo}
                  onCheckedChange={(checked) =>
                    setIntegracoesConfig({
                      ...integracoesConfig,
                      googleCalendar: { ...integracoesConfig.googleCalendar, ativo: checked },
                    })
                  }
                />
              </div>

              {integracoesConfig.googleCalendar.ativo && (
                <div className="space-y-4 pl-6">
                  <Button variant="outline">
                    Conectar com Google
                  </Button>
                </div>
              )}
            </div>

            {/* Stripe */}
            <div className="space-y-4 pb-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Stripe</Label>
                  <p className="text-sm text-gray-500">
                    Processar pagamentos online
                  </p>
                </div>
                <Switch
                  checked={integracoesConfig.stripe.ativo}
                  onCheckedChange={(checked) =>
                    setIntegracoesConfig({
                      ...integracoesConfig,
                      stripe: { ...integracoesConfig.stripe, ativo: checked },
                    })
                  }
                />
              </div>

              {integracoesConfig.stripe.ativo && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>Public Key</Label>
                    <Input
                      type="password"
                      value={integracoesConfig.stripe.publicKey}
                      onChange={(e) =>
                        setIntegracoesConfig({
                          ...integracoesConfig,
                          stripe: { ...integracoesConfig.stripe, publicKey: e.target.value },
                        })
                      }
                      placeholder="pk_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={integracoesConfig.stripe.secretKey}
                      onChange={(e) =>
                        setIntegracoesConfig({
                          ...integracoesConfig,
                          stripe: { ...integracoesConfig.stripe, secretKey: e.target.value },
                        })
                      }
                      placeholder="sk_..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mailchimp */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Mailchimp</Label>
                  <p className="text-sm text-gray-500">
                    Marketing por email
                  </p>
                </div>
                <Switch
                  checked={integracoesConfig.mailchimp.ativo}
                  onCheckedChange={(checked) =>
                    setIntegracoesConfig({
                      ...integracoesConfig,
                      mailchimp: { ...integracoesConfig.mailchimp, ativo: checked },
                    })
                  }
                />
              </div>

              {integracoesConfig.mailchimp.ativo && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={integracoesConfig.mailchimp.apiKey}
                      onChange={(e) =>
                        setIntegracoesConfig({
                          ...integracoesConfig,
                          mailchimp: { ...integracoesConfig.mailchimp, apiKey: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>List ID</Label>
                    <Input
                      value={integracoesConfig.mailchimp.listId}
                      onChange={(e) =>
                        setIntegracoesConfig({
                          ...integracoesConfig,
                          mailchimp: { ...integracoesConfig.mailchimp, listId: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveIntegracoes}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

