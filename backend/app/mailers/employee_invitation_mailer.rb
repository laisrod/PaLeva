class EmployeeInvitationMailer < ApplicationMailer
  def invite(invitation)
    @invitation = invitation
    @establishment = invitation.establishment

    mail(
      to: invitation.email,
      subject: "Convite para trabalhar em #{@establishment.name}"
    )
  end
end
