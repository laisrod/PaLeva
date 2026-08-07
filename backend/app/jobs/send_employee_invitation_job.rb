class SendEmployeeInvitationJob < ApplicationJob
  queue_as :mailers

  def perform(invitation_id)
    invitation = EmployeeInvitation.find(invitation_id)
    EmployeeInvitationMailer.invite(invitation).deliver_now
  end
end
