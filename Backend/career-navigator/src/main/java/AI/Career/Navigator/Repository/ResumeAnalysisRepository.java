package AI.Career.Navigator.Repository;

import AI.Career.Navigator.Entity.ResumeAnalysis;
import AI.Career.Navigator.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findByUser(User user);
}