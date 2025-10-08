import BatchMetadata from '../../features/trainee/myproject/BatchMetadata';
import ProjectDocuments from '../../features/trainee/myproject/DocumentUpload';
import TeamList from '../../features/trainee/myproject/TeamList';
import CompletionRate from '../../features/trainee/myproject/Completionrate';

function MyProject() {
  return (
    <div>
      <BatchMetadata
        name="ILP 2024-25 BATCH 1"
        trainees={7}
        techStack={["React", ".NET"]}
        repositoryUrl="https://github.com/dkxc/ILPRepo"
        figmaUrl="https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0"
      />
      <ProjectDocuments />
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 20, marginTop: 20, marginRight: 20 }}>
        <div style={{ width: '70%' }}>
          <TeamList />
        </div>
        <div style={{ width: '30%', marginLeft: 20 }}>
          <CompletionRate />
        </div>
      </div>
    </div>
  )
}

export default MyProject;